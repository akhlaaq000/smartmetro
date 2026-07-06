import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { getDatabase } from "./database";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: isProd ? "production" : "development" });
  });

  
  app.get("/api/tickets", async (req, res) => {
    try {
      const db = await getDatabase();
      const tickets = await db.all("SELECT * FROM tickets ORDER BY purchaseTime DESC");
      res.json(tickets);
    } catch (err: any) {
      console.error("Error retrieving tickets:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  app.post("/api/tickets", async (req, res) => {
    const { id, sourceId, sourceName, destId, destName, passengerCount, totalFare, purchaseTime, qrCodeValue, status, mobileNumber } = req.body;
    try {
      const db = await getDatabase();
      await db.run(
        `INSERT INTO tickets (id, sourceId, sourceName, destId, destName, passengerCount, totalFare, purchaseTime, qrCodeValue, status, mobileNumber)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, sourceId, sourceName, destId, destName, passengerCount, totalFare, purchaseTime, qrCodeValue, status, mobileNumber || null]
      );
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error saving ticket:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  app.delete("/api/tickets", async (req, res) => {
    try {
      const db = await getDatabase();
      await db.run("DELETE FROM tickets");
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error clearing tickets:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin123") {
      res.json({ success: true, token: "simulated-admin-token" });
    } else {
      res.status(401).json({ success: false, error: "Invalid username or password. Default is admin / admin123." });
    }
  });

  
  app.get("/api/smart-cards", async (req, res) => {
    try {
      const db = await getDatabase();
      const cards = await db.all("SELECT * FROM smart_cards ORDER BY createdTime DESC");
      res.json(cards);
    } catch (err: any) {
      console.error("Error retrieving smart cards:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  app.get("/api/smart-card/:cardNumber", async (req, res) => {
    const { cardNumber } = req.params;
    try {
      const db = await getDatabase();
      const card = await db.get("SELECT * FROM smart_cards WHERE cardNumber = ?", [cardNumber]);
      if (!card) {
        return res.status(404).json({ error: "Smart card not found." });
      }
      const history = await db.all(
        "SELECT stationId, stationName, action, timestamp, deduction, balanceAfter FROM stoppage_history WHERE cardNumber = ? ORDER BY id DESC",
        [card.cardNumber]
      );
      res.json({
        ...card,
        stoppageHistory: history,
      });
    } catch (err: any) {
      console.error("Error retrieving smart card:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  app.get("/api/tickets/mobile/:mobileNumber", async (req, res) => {
    const { mobileNumber } = req.params;
    try {
      const db = await getDatabase();
      const tickets = await db.all("SELECT * FROM tickets WHERE mobileNumber = ? ORDER BY purchaseTime DESC", [mobileNumber]);
      res.json(tickets);
    } catch (err: any) {
      console.error("Error retrieving tickets by mobile:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  app.get("/api/smart-cards/mobile/:mobileNumber", async (req, res) => {
    const { mobileNumber } = req.params;
    try {
      const db = await getDatabase();
      const cards = await db.all("SELECT * FROM smart_cards WHERE mobileNumber = ? ORDER BY createdTime DESC", [mobileNumber]);
      res.json(cards);
    } catch (err: any) {
      console.error("Error retrieving smart cards by mobile:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  app.post("/api/smart-card", async (req, res) => {
    const { cardNumber, holderName, balance, createdTime, mobileNumber } = req.body;
    try {
      const db = await getDatabase();
      await db.run(
        `INSERT INTO smart_cards (cardNumber, holderName, balance, createdTime, mobileNumber)
         VALUES (?, ?, ?, ?, ?)`,
        [cardNumber, holderName, balance, createdTime, mobileNumber || null]
      );
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error issuing smart card:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  app.post("/api/smart-card/topup", async (req, res) => {
    const { cardNumber, amount } = req.body;
    try {
      const db = await getDatabase();
      await db.run("UPDATE smart_cards SET balance = balance + ? WHERE cardNumber = ?", [amount, cardNumber]);
      const updatedCard = await db.get("SELECT balance FROM smart_cards WHERE cardNumber = ?", [cardNumber]);
      res.json({ success: true, balance: updatedCard.balance });
    } catch (err: any) {
      console.error("Error topping up smart card:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  app.post("/api/smart-card/ride", async (req, res) => {
    const { cardNumber, sourceId, sourceName, destId, destName, fare, timestamp } = req.body;
    try {
      const db = await getDatabase();
      const card = await db.get("SELECT balance FROM smart_cards WHERE cardNumber = ?", [cardNumber]);
      if (!card) {
        return res.status(404).json({ error: "Smart card not found." });
      }
      if (card.balance < fare) {
        return res.status(400).json({ error: "Insufficient funds." });
      }

      await db.run("BEGIN TRANSACTION");
      const newBalance = card.balance - fare;
      await db.run("UPDATE smart_cards SET balance = ? WHERE cardNumber = ?", [newBalance, cardNumber]);

      
      await db.run(
        `INSERT INTO stoppage_history (cardNumber, stationId, stationName, action, timestamp, deduction, balanceAfter)
         VALUES (?, ?, ?, 'Tap-In', ?, 0, ?)`,
        [cardNumber, sourceId, sourceName, timestamp, card.balance]
      );

      
      await db.run(
        `INSERT INTO stoppage_history (cardNumber, stationId, stationName, action, timestamp, deduction, balanceAfter)
         VALUES (?, ?, ?, 'Tap-Out', ?, ?, ?)`,
        [cardNumber, destId, destName, timestamp, fare, newBalance]
      );

      await db.run("COMMIT");
      res.json({ success: true, balance: newBalance });
    } catch (err: any) {
      try {
        const db = await getDatabase();
        await db.run("ROLLBACK");
      } catch {}
      console.error("Error simulating smart card ride:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  try {
    console.log("Initializing SQLite database...");
    await getDatabase();
    console.log("Database initialized successfully.");
  } catch (dbError) {
    console.error("Database initialization failed:", dbError);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartMetro Full-Stack server is operational on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start full-stack server:", error);
});
