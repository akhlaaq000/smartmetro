import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(process.cwd(), 'metro.db');
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  
  await dbInstance.exec('PRAGMA foreign_keys = ON;');

  
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      sourceId TEXT NOT NULL,
      sourceName TEXT NOT NULL,
      destId TEXT NOT NULL,
      destName TEXT NOT NULL,
      passengerCount INTEGER NOT NULL,
      totalFare REAL NOT NULL,
      purchaseTime TEXT NOT NULL,
      qrCodeValue TEXT NOT NULL,
      status TEXT NOT NULL,
      mobileNumber TEXT
    );

    CREATE TABLE IF NOT EXISTS smart_cards (
      cardNumber TEXT PRIMARY KEY,
      holderName TEXT NOT NULL,
      balance REAL NOT NULL,
      createdTime TEXT NOT NULL,
      mobileNumber TEXT
    );

    CREATE TABLE IF NOT EXISTS stoppage_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cardNumber TEXT NOT NULL,
      stationId TEXT NOT NULL,
      stationName TEXT NOT NULL,
      action TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      deduction REAL NOT NULL,
      balanceAfter REAL NOT NULL,
      FOREIGN KEY(cardNumber) REFERENCES smart_cards(cardNumber) ON DELETE CASCADE
    );
  `);

  
  try {
    await dbInstance.exec('ALTER TABLE smart_cards ADD COLUMN mobileNumber TEXT;');
  } catch (e) {
    
  }

  try {
    await dbInstance.exec('ALTER TABLE tickets ADD COLUMN mobileNumber TEXT;');
  } catch (e) {
    
  }

  return dbInstance;
}
