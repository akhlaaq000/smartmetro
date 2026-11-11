import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { allStationsMap, planRoute } from './data/stations';
import { Smile, ArrowRight, QrCode } from 'lucide-react';
import StationSelect from './components/StationSelect';
import SmartCardManager from './components/SmartCardManager';
import PaymentModal from './components/PaymentModal';

interface GuestTicket {
  id: string;
  sourceName: string;
  destName: string;
  passengerCount: number;
  totalFare: number;
  purchaseTime: string;
  qrCodeValue: string;
  status: string;
  mobileNumber?: string | null;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'booking' | 'card' | 'admin' | 'user-auth' | 'dashboard'>('booking');
  const [userMobile, setUserMobile] = useState<string | null>(null);

  
  const [sourceId, setSourceId] = useState('challaghatta');
  const [destId, setDestId] = useState('whitefield');
  const [passengerCount, setPassengerCount] = useState(1);
  const [activeTicket, setActiveTicket] = useState<GuestTicket | null>(null);

  
  const [sessionTickets, setSessionTickets] = useState<GuestTicket[]>(() => {
    try {
      const stored = localStorage.getItem('smartmetro_guest_tickets');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [userTickets, setUserTickets] = useState<GuestTicket[]>([]);
  const [userCards, setUserCards] = useState<any[]>([]);
  const [selectedDashboardCard, setSelectedDashboardCard] = useState<any | null>(null);
  const [dashboardCardDetails, setDashboardCardDetails] = useState<any | null>(null);

  
  useEffect(() => {
    try {
      localStorage.setItem('smartmetro_guest_tickets', JSON.stringify(sessionTickets));
    } catch (err) {
      console.error("Failed to persist guest tickets:", err);
    }
  }, [sessionTickets]);

  
  useEffect(() => {
    if (selectedDashboardCard) {
      const fetchDetails = async () => {
        try {
          const res = await fetch(`/api/smart-card/${selectedDashboardCard.cardNumber}`);
          if (res.ok) {
            const data = await res.json();
            setDashboardCardDetails(data);
          }
        } catch (err) {
          console.error("Error fetching card details in dashboard:", err);
        }
      };
      fetchDetails();
    } else {
      setDashboardCardDetails(null);
    }
  }, [selectedDashboardCard]);

  
  useEffect(() => {
    if (userMobile) {
      const fetchUserData = async () => {
        try {
          
          const ticketsRes = await fetch(`/api/tickets/mobile/${userMobile}`);
          if (ticketsRes.ok) {
            const data = await ticketsRes.json();
            setUserTickets(data);
          }
          
          const cardsRes = await fetch(`/api/smart-cards/mobile/${userMobile}`);
          if (cardsRes.ok) {
            const data = await cardsRes.json();
            setUserCards(data);
            
            
            if (selectedDashboardCard) {
              const matching = data.find((c: any) => c.cardNumber === selectedDashboardCard.cardNumber);
              if (matching) {
                setSelectedDashboardCard(matching);
              }
            }
          }
        } catch (err) {
          console.error("Error fetching user profile data:", err);
        }
      };
      fetchUserData();
    } else {
      setUserTickets([]);
      setUserCards([]);
      setSelectedDashboardCard(null);
      setDashboardCardDetails(null);
    }
  }, [userMobile, currentView]);

  
  const [showPayment, setShowPayment] = useState(false);

  
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [adminTickets, setAdminTickets] = useState<any[]>([]);
  const [adminCards, setAdminCards] = useState<any[]>([]);

  
  const calculatedRoute = planRoute(sourceId, destId);
  const totalFare = calculatedRoute ? calculatedRoute.fare * passengerCount : 0;

  
  const handleBookTicketClick = () => {
    if (sourceId === destId) {
      alert("Please select different starting and destination stations.");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    const sourceStation = allStationsMap.get(sourceId);
    const destStation = allStationsMap.get(destId);
    if (!sourceStation || !destStation) return;

    const randomId = `GST-${Math.floor(100000 + Math.random() * 900000)}`;
    const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const fullPurchaseTime = `${new Date().toLocaleDateString()} ${timeString}`;

    const newTicket: GuestTicket = {
      id: randomId,
      sourceName: sourceStation.name,
      destName: destStation.name,
      passengerCount,
      totalFare,
      purchaseTime: fullPurchaseTime,
      qrCodeValue: `METRO-GUEST-${randomId}-${sourceId}-${destId}-${passengerCount}`,
      status: 'Active',
      mobileNumber: userMobile
    };

    try {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: randomId,
          sourceId,
          sourceName: sourceStation.name,
          destId,
          destName: destStation.name,
          passengerCount,
          totalFare,
          purchaseTime: fullPurchaseTime,
          qrCodeValue: newTicket.qrCodeValue,
          status: 'Active',
          mobileNumber: userMobile
        })
      });
      setActiveTicket(newTicket);
      if (userMobile) {
        setUserTickets(prev => [newTicket, ...prev]);
      } else {
        setSessionTickets(prev => [newTicket, ...prev]);
      }
    } catch (err) {
      console.error("Error saving ticket in db:", err);
      setActiveTicket(newTicket); 
      if (userMobile) {
        setUserTickets(prev => [newTicket, ...prev]);
      } else {
        setSessionTickets(prev => [newTicket, ...prev]);
      }
    }
    setShowPayment(false);
  };

  
  const loadAdminData = async () => {
    try {
      const ticketsRes = await fetch('/api/tickets');
      if (ticketsRes.ok) {
        const tickets = await ticketsRes.json();
        setAdminTickets(tickets);
      }
      
      const cardsRes = await fetch('/api/smart-cards');
      if (cardsRes.ok) {
        const cards = await cardsRes.json();
        setAdminCards(cards);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setAdminToken(data.token);
        loadAdminData();
      } else {
        const errData = await res.json();
        setLoginError(errData.error || 'Login failed.');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication server.');
    }
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminUsername('');
    setAdminPassword('');
    setAdminTickets([]);
    setAdminCards([]);
  };

  const handleAdminClearTickets = async () => {
    if (!window.confirm("Are you sure you want to clear all guest ticket booking records?")) return;
    try {
      const res = await fetch('/api/tickets', { method: 'DELETE' });
      if (res.ok) {
        setAdminTickets([]);
        alert("All guest ticket records cleared successfully.");
      }
    } catch (err) {
      console.error("Error clearing tickets:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-150 flex flex-col font-sans selection:bg-slate-800 selection:text-slate-100 antialiased">
      
      {}
      <header className="border-b border-slate-800 bg-slate-900 px-4 py-4 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            Bangalore SmartMetro
          </h1>
          
          {/* Menu Row */}
          <nav className="flex flex-wrap items-center gap-6 text-sm font-semibold tracking-wider uppercase">
            <button
              onClick={() => { setCurrentView('booking'); setActiveTicket(null); }}
              className={`pb-1 transition cursor-pointer ${
                currentView === 'booking'
                  ? 'text-slate-100 border-b-2 border-slate-100 font-bold'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Virtual Ticket Booking
            </button>
            <button
              onClick={() => setCurrentView('card')}
              className={`pb-1 transition cursor-pointer ${
                currentView === 'card'
                  ? 'text-slate-100 border-b-2 border-slate-100 font-bold'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Check Balance and Top-Up
            </button>
            
            <button
              onClick={() => { setCurrentView('dashboard'); setActiveTicket(null); }}
              className={`pb-1 transition cursor-pointer ${
                currentView === 'dashboard'
                  ? 'text-slate-100 border-b-2 border-slate-100 font-bold'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Dashboard
            </button>
            
            {userMobile ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono select-none bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded-lg">
                <Smile size={14} className="text-emerald-400 shrink-0" />
                <span>+91 {userMobile}</span>
                <button
                  onClick={() => {
                    setUserMobile(null);
                    alert("Logged out successfully.");
                    if (currentView === 'user-auth' || currentView === 'dashboard') {
                      setCurrentView('booking');
                    }
                  }}
                  className="text-red-400 hover:text-red-300 ml-1.5 font-bold uppercase cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('user-auth')}
                className={`pb-1 transition cursor-pointer ${
                  currentView === 'user-auth'
                    ? 'text-slate-100 border-b-2 border-slate-100 font-bold'
                    : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                Login / Register
              </button>
            )}

            <button
              onClick={() => setCurrentView('admin')}
              className={`pb-1 transition cursor-pointer ${
                currentView === 'admin'
                  ? 'text-slate-100 border-b-2 border-slate-100 font-bold'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Admin Portal
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-6 my-4">
        
        {activeTicket ? (
          /* Ticket Success Display Card (Global Pass View) */
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
              id="active-ticket-display"
            >
              <div className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden shadow-inner">
                <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 font-bold">METRO EXPRESS PASS</span>
                  <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-920 px-2 rounded font-bold uppercase tracking-wider">
                    {activeTicket.status || 'Active'}
                  </span>
                </div>

                <div className="p-5 space-y-4 text-base">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-500 block uppercase font-medium">Starting Point</span>
                      <strong className="text-slate-200 text-lg">{activeTicket.sourceName}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block uppercase font-medium">Destination Point</span>
                      <strong className="text-slate-200 text-lg">{activeTicket.destName}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-slate-900 pt-3">
                    <div>
                      <span className="text-xs text-slate-500 block uppercase font-medium">Quantity</span>
                      <strong className="text-slate-200">{activeTicket.passengerCount}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block uppercase font-medium">Fare Paid</span>
                      <strong className="text-slate-200 font-mono">₹{activeTicket.totalFare}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block uppercase font-medium">Issued Time</span>
                      <strong className="text-slate-200">{activeTicket.purchaseTime}</strong>
                    </div>
                  </div>

                  {/* Barcode / QR Section */}
                  <div className="border-t border-dashed border-slate-800 pt-5 text-center flex flex-col items-center select-none">
                    <div className="bg-white p-3 rounded-lg inline-block shadow-lg">
                      <QRCodeSVG value={activeTicket.qrCodeValue} size={160} level="M" marginSize={4} />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTicket(null)}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold uppercase rounded-lg transition cursor-pointer"
                id="reset-booking-btn"
              >
                {currentView === 'dashboard' ? 'Back to Dashboard' : 'Book Another Journey'}
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {currentView === 'booking' && (
              
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-200 tracking-tight">
                      Virtual Ticket Booking
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {}
                    <div className="space-y-4">
                      <StationSelect
                        label="Starting Station"
                        selectedStationId={sourceId}
                        onSelectStation={setSourceId}
                        excludeStationId={destId}
                        id="source-station-select"
                      />

                      <div className="flex justify-center select-none">
                        <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 bg-slate-950">
                          <ArrowRight size={14} />
                        </div>
                      </div>

                      <StationSelect
                        label="Destination Station"
                        selectedStationId={destId}
                        onSelectStation={setDestId}
                        excludeStationId={sourceId}
                        id="dest-station-select"
                      />
                    </div>

                    {/* Passenger Select */}
                    <div>
                      <label className="block text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Passenger Count
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={`passengers-${num}`}
                            type="button"
                            onClick={() => setPassengerCount(num)}
                            className={`py-3 rounded-lg text-base font-bold transition cursor-pointer border ${
                              passengerCount === num
                                ? 'bg-slate-150 text-slate-950 border-slate-700 shadow-sm'
                                : 'bg-slate-950 text-slate-450 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Details */}
                    {calculatedRoute && (
                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between text-base text-slate-450">
                          <span>Journey Summary:</span>
                          <span>{calculatedRoute.stopsCount} stops ({calculatedRoute.durationMinutes} mins)</span>
                        </div>
                        <div className="flex justify-between items-baseline border-t border-slate-850 pt-2.5 mt-2.5">
                          <span className="text-base text-slate-450">Total Price:</span>
                          <strong className="text-2xl font-mono font-black text-slate-200" id="ticket-total-fare">₹{totalFare}</strong>
                        </div>
                      </div>
                    )}

                    {}
                    <button
                      type="button"
                      onClick={handleBookTicketClick}
                      className="w-full py-3.5 bg-slate-150 text-slate-950 font-bold uppercase rounded-lg transition cursor-pointer text-base"
                      id="book-ticket-btn"
                    >
                      Book Ticket
                    </button>
                  </div>
                </div>

                {/* Consolidated Your Bookings List */}
                {((userMobile && userTickets.length > 0) || (!userMobile && sessionTickets.length > 0)) && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 tracking-tight">
                        Your Bookings {userMobile ? `(+91 ${userMobile})` : '(Guest Session)'}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {(userMobile ? userTickets : sessionTickets).map((ticket) => (
                        <div
                          key={ticket.id}
                          onClick={() => setActiveTicket(ticket)}
                          className="bg-slate-950 hover:bg-slate-850/40 border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition flex justify-between items-center group"
                        >
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                              <span>{ticket.sourceName}</span>
                              <ArrowRight size={12} className="text-slate-500" />
                              <span>{ticket.destName}</span>
                            </div>
                            <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                              <span>Qty: {ticket.passengerCount}</span>
                              <span>•</span>
                              <span>{ticket.purchaseTime}</span>
                              <span>•</span>
                              <span className="font-mono">{ticket.id}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-black font-mono text-slate-200">
                              ₹{ticket.totalFare}
                            </span>
                            <div className="p-2 bg-slate-900 rounded-lg text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800 transition">
                              <QrCode size={16} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

        {currentView === 'dashboard' && (
          /* Dashboard View */
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-200 tracking-tight">
                    My Profile Dashboard
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {userMobile ? `Logged in with +91 ${userMobile}` : 'Guest Session View'}
                  </p>
                </div>
                {!userMobile && (
                  <button
                    onClick={() => setCurrentView('user-auth')}
                    className="px-4 py-2 bg-slate-150 text-slate-950 font-bold rounded-lg cursor-pointer text-xs uppercase transition"
                  >
                    Login / Register Profile
                  </button>
                )}
              </div>

              {/* Cards Section */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-350 tracking-wider uppercase">Your Smart Cards</h3>
                {userMobile ? (
                  userCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userCards.map((c) => (
                        <div
                          key={c.cardNumber}
                          onClick={() => setSelectedDashboardCard(selectedDashboardCard?.cardNumber === c.cardNumber ? null : c)}
                          className={`relative overflow-hidden p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between h-40 select-none ${
                            selectedDashboardCard?.cardNumber === c.cardNumber
                              ? 'bg-gradient-to-br from-slate-805 to-slate-950 border-slate-600 shadow-lg'
                              : 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 hover:border-slate-700 hover:shadow-md'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block">Namma Smart Card</span>
                              <span className="text-sm font-semibold text-slate-200 mt-1 block">{c.holderName}</span>
                            </div>
                            <div className="w-9 h-7 bg-amber-500/25 border border-amber-500/30 rounded-md flex items-center justify-center text-[10px] font-bold text-amber-500 font-mono">
                              CHIP
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <span className="text-[10px] text-slate-500 block font-mono">Card Serial Reference</span>
                            <span className="text-base font-mono font-black text-slate-300 tracking-wider block">{c.cardNumber}</span>
                          </div>

                          <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-slate-900">
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Current Balance</span>
                            <span className="text-lg font-mono font-black text-emerald-400">₹{c.balance.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl text-center space-y-3">
                      <p className="text-sm text-slate-450 italic">No registered Smart Cards found on this profile.</p>
                      <button
                        onClick={() => setCurrentView('card')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold uppercase rounded-lg cursor-pointer transition"
                      >
                        Generate Smart Card
                      </button>
                    </div>
                  )
                ) : (
                  <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl text-center space-y-2">
                    <p className="text-sm text-slate-450 italic">Smart card services are restricted to registered profiles.</p>
                    <p className="text-xs text-slate-650">Log in with your mobile number to register or view cards.</p>
                  </div>
                )}

                {/* Dashboard Card Ride & Transaction History */}
                {selectedDashboardCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-950 border border-slate-850 rounded-xl p-5 mt-4 space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-300 font-sans">Transaction History</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedDashboardCard.cardNumber}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentView('card');
                        }}
                        className="px-3 py-1 bg-slate-150 text-slate-950 font-bold rounded-lg cursor-pointer text-[10px] uppercase transition"
                      >
                        Top-Up Card
                      </button>
                    </div>

                    {dashboardCardDetails && dashboardCardDetails.stoppageHistory && dashboardCardDetails.stoppageHistory.length > 0 ? (
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {dashboardCardDetails.stoppageHistory.map((h: any, idx: number) => (
                          <div key={`hist-${idx}`} className="flex justify-between items-center text-xs text-slate-400 py-1.5 border-b border-slate-900 last:border-0">
                            <div>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mr-2 ${
                                h.action === 'Tap-In'
                                  ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40'
                                  : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                              }`}>
                                {h.action}
                              </span>
                              <strong>{h.stationName}</strong>
                              <span className="text-[10px] text-slate-550 block mt-0.5 font-mono">{h.timestamp}</span>
                            </div>
                            <div className="text-right">
                              {h.deduction > 0 ? (
                                <span className="text-red-400 font-mono font-bold">-₹{h.deduction}</span>
                              ) : (
                                <span className="text-slate-500 font-mono">—</span>
                              )}
                              <span className="text-[10px] text-slate-550 block font-mono">Bal: ₹{h.balanceAfter}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No tap history or transaction history found for this card.</p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Tickets Section */}
              <div className="space-y-4 mt-8">
                <h3 className="text-base font-bold text-slate-350 tracking-wider uppercase">Your Booking History</h3>
                
                {((userMobile && userTickets.length > 0) || (!userMobile && sessionTickets.length > 0)) ? (
                  <div className="space-y-3">
                    {(userMobile ? userTickets : sessionTickets).map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setActiveTicket(ticket)}
                        className="bg-slate-950 hover:bg-slate-850/40 border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition flex justify-between items-center group"
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                            <span>{ticket.sourceName}</span>
                            <ArrowRight size={12} className="text-slate-500" />
                            <span>{ticket.destName}</span>
                          </div>
                          <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                            <span>Qty: {ticket.passengerCount}</span>
                            <span>•</span>
                            <span>{ticket.purchaseTime}</span>
                            <span>•</span>
                            <span className="font-mono">{ticket.id}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-base font-black font-mono text-slate-200">
                            ₹{ticket.totalFare}
                          </span>
                          <div className="p-2 bg-slate-900 rounded-lg text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800 transition">
                            <QrCode size={16} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl text-center space-y-3">
                    <p className="text-sm text-slate-450 italic">No tickets found on this session.</p>
                    <button
                      onClick={() => setCurrentView('booking')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold uppercase rounded-lg cursor-pointer transition"
                    >
                      Book A Journey Now
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {currentView === 'card' && (
          /* Smart Card Manager View */
          <div className="space-y-6">
            <SmartCardManager userMobile={userMobile} setUserMobile={setUserMobile} />
          </div>
        )}

        {currentView === 'user-auth' && (
          /* User Login/Registration View */
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-200 tracking-tight">
                  User Login / Register
                </h2>
              </div>
              
              {!userMobile ? (
                <UserMobileAuth onAuthSuccess={(mobile) => {
                  setUserMobile(mobile);
                  setCurrentView('dashboard');
                }} />
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-350">
                    Logged in: <strong className="text-emerald-400 font-mono">+91 {userMobile}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMobile(null);
                      alert("Logged out successfully.");
                    }}
                    className="w-full py-2.5 bg-red-950/40 hover:bg-red-950/60 border border-red-900 text-red-200 text-xs font-bold uppercase rounded-lg cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'admin' && (
          /* Admin View */
          <div className="space-y-6">
            {!adminToken ? (
              /* Admin Login Form */
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-slate-200 tracking-tight">
                    Admin Authentication
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Default: admin / admin123</p>
                </div>

                <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</label>
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-hidden"
                      required
                    />
                  </div>

                  {loginError && (
                    <p className="text-xs text-red-400">{loginError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-150 text-slate-950 font-bold uppercase rounded-lg cursor-pointer transition text-sm"
                  >
                    Authenticate
                  </button>
                </form>
              </div>
            ) : (
              /* Admin Dashboard View */
              <div className="space-y-6">
                
                {/* Dashboard Stats */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-200">Admin Dashboard</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Logged in as Administrator</p>
                  </div>
                  <button
                    onClick={handleAdminLogout}
                    className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-850 hover:border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-semibold uppercase rounded-lg cursor-pointer transition"
                  >
                    Logout
                  </button>
                </div>

                {/* Sales statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Tickets Issued</span>
                    <strong className="text-2xl font-mono font-bold text-slate-200 mt-1 block">{adminTickets.length}</strong>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Revenue Collected</span>
                    <strong className="text-2xl font-mono font-bold text-slate-200 mt-1 block">₹{adminTickets.reduce((sum, t) => sum + t.totalFare, 0)}</strong>
                  </div>
                </div>

                {/* Tickets Database Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="text-base font-bold text-slate-200">Guest Ticket Records</h3>
                    {adminTickets.length > 0 && (
                      <button
                        onClick={handleAdminClearTickets}
                        className="text-xs font-bold text-red-500 hover:text-red-400 cursor-pointer uppercase transition"
                      >
                        Clear Ticket History
                      </button>
                    )}
                  </div>

                  {adminTickets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500">
                            <th className="py-2 font-semibold uppercase">Ticket ID</th>
                            <th className="py-2 font-semibold uppercase">Route</th>
                            <th className="py-2 font-semibold uppercase text-center">Qty</th>
                            <th className="py-2 font-semibold uppercase text-right">Fare</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminTickets.map((t) => (
                            <tr key={t.id} className="border-b border-slate-850 text-slate-350">
                              <td className="py-2 font-mono">{t.id}</td>
                              <td className="py-2">{t.sourceName} → {t.destName}</td>
                              <td className="py-2 text-center">{t.passengerCount}</td>
                              <td className="py-2 text-right font-mono">₹{t.totalFare}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic py-2">No guest tickets found in database.</p>
                  )}
                </div>

                {/* Smart Cards Database Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2">
                    Registered Smart Cards
                  </h3>

                  {adminCards.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500">
                            <th className="py-2 font-semibold uppercase">Holder</th>
                            <th className="py-2 font-semibold uppercase">Mobile</th>
                            <th className="py-2 font-semibold uppercase">Serial Ref</th>
                            <th className="py-2 font-semibold uppercase text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminCards.map((c) => (
                            <tr key={c.cardNumber} className="border-b border-slate-850 text-slate-350">
                              <td className="py-2">{c.holderName}</td>
                              <td className="py-2 font-mono">{c.mobileNumber ? `+91 ${c.mobileNumber}` : <span className="text-slate-500 italic">None</span>}</td>
                              <td className="py-2 font-mono">{c.cardNumber}</td>
                              <td className="py-2 text-right font-mono">₹{c.balance.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic py-2">No smart cards found in database.</p>
                  )}
                </div>

              </div>
            )}
          </div>
        )}
      </>
    )}
  </main>

      {/* Styled Footer Block */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 px-6 mt-12 text-center text-sm text-slate-500 font-medium select-none shrink-0">
        <div className="max-w-7xl mx-auto">
          <span>© 2026 Bangalore Transit Authority (BMRCL)</span>
        </div>
      </footer>

      {/* Unified payment modal */}
      <PaymentModal
        isOpen={showPayment}
        amount={totalFare}
        purpose="GUEST TICKET PURCHASE"
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
      />

    </div>
  );
}

function UserMobileAuth({ onAuthSuccess }: { onAuthSuccess: (mobile: string) => void }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSendOtp = () => {
    if (mobileNumber.length !== 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    setAuthError(null);
  };

  const handleVerifyOtp = () => {
    if (otpCode === generatedOtp) {
      onAuthSuccess(mobileNumber);
    } else {
      setAuthError('Invalid OTP. Please check the simulated SMS Gateway notification.');
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-350">
      {!isOtpSent ? (
        <div className="space-y-3">
          <input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-hidden font-mono"
          />
          {authError && <p className="text-xs text-red-400">{authError}</p>}
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={mobileNumber.length !== 10}
            className="w-full py-2.5 bg-slate-150 text-slate-950 font-bold uppercase rounded-lg cursor-pointer disabled:opacity-50 text-xs transition-all"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Simulated SMS Gateway Notification Banner */}
          <div className="bg-slate-950 border border-emerald-905 p-2.5 rounded-lg text-xs text-emerald-400 font-mono text-center">
            Simulated OTP code is: <span className="text-slate-100 text-sm font-black underline decoration-2">{generatedOtp}</span>
          </div>

          <input
            type="text"
            placeholder="Enter 4-digit OTP"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-hidden text-center font-mono tracking-widest text-lg"
          />

          {authError && <p className="text-xs text-red-400">{authError}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setIsOtpSent(false); setOtpCode(''); setAuthError(null); }}
              className="w-1/2 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 hover:border-slate-750 font-semibold rounded-lg cursor-pointer text-xs"
            >
              Change Mobile
            </button>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpCode.length !== 4}
              className="w-1/2 py-2 bg-slate-150 text-slate-950 font-bold uppercase rounded-lg cursor-pointer disabled:opacity-50 text-xs transition-all"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
