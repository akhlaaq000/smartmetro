import React, { useState, useEffect } from 'react';
import { SmartCard } from '../types';
import PaymentModal from './PaymentModal';

interface SmartCardManagerProps {
  userMobile: string | null;
  setUserMobile: (mobile: string | null) => void;
}

export default function SmartCardManager({ userMobile, setUserMobile }: SmartCardManagerProps) {
  const [card, setCard] = useState<SmartCard | null>(null);
  const [queryNumber, setQueryNumber] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  
  const [userCards, setUserCards] = useState<SmartCard[]>([]);

  
  const [newHolderName, setNewHolderName] = useState('');
  
  
  const [topUpAmount, setTopUpAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchUserCards = async () => {
    if (!userMobile) {
      setUserCards([]);
      return;
    }
    try {
      const res = await fetch(`/api/smart-cards/mobile/${userMobile}`);
      if (res.ok) {
        const data = await res.json();
        setUserCards(data);
        
        
        if (data.length > 0) {
          const alreadySelected = card && data.find((c: any) => c.cardNumber === card.cardNumber);
          if (!alreadySelected) {
            const cardRes = await fetch(`/api/smart-card/${data[0].cardNumber}`);
            if (cardRes.ok) {
              const cardData = await cardRes.json();
              setCard(cardData);
              setQueryNumber(data[0].cardNumber);
            }
          }
        } else {
          setCard(null);
          setQueryNumber('');
        }
      }
    } catch (err) {
      console.error("Error fetching user cards:", err);
    }
  };

  useEffect(() => {
    fetchUserCards();
  }, [userMobile]);

  
  const handleCheckBalance = async () => {
    if (!queryNumber.trim()) return;
    setSearchError(null);
    try {
      const res = await fetch(`/api/smart-card/${queryNumber.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setCard(data);
      } else {
        setCard(null);
        setSearchError('Smart card not found.');
      }
    } catch (err) {
      setCard(null);
      setSearchError('Error checking card details.');
    }
  };

  
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
      setUserMobile(mobileNumber);
      setAuthError(null);
    } else {
      setAuthError('Invalid OTP. Please check the simulated SMS Gateway notification.');
    }
  };

  
  const handleCreateCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolderName.trim() || !userMobile) return;

    const newCardNumber = `NMC-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCard: SmartCard = {
      cardNumber: newCardNumber,
      holderName: newHolderName.trim(),
      balance: 100, 
      createdTime: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      stoppageHistory: [],
      mobileNumber: userMobile
    };

    try {
      const res = await fetch('/api/smart-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard)
      });
      if (res.ok) {
        setCard(newCard);
        setQueryNumber(newCardNumber);
        setSearchError(null);
        setNewHolderName('');
        
        
        setMobileNumber('');
        setOtpCode('');
        setGeneratedOtp(null);
        setIsOtpSent(false);
        setAuthError(null);
        
        await fetchUserCards();
        
        alert(`Smart Card generated successfully!\nCard Serial Reference: ${newCardNumber}\nBalance: ₹100.00`);
      }
    } catch (err) {
      console.error("Error issuing smart card:", err);
    }
  };

  const handleTopUpTrigger = () => {
    let finalAmount = topUpAmount;
    if (customAmount) {
      const parsed = parseInt(customAmount);
      if (isNaN(parsed) || parsed <= 0) return;
      finalAmount = parsed;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    if (!card) return;
    let finalAmount = topUpAmount;
    if (customAmount) {
      finalAmount = parseInt(customAmount);
    }
    
    try {
      const res = await fetch('/api/smart-card/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber: card.cardNumber, amount: finalAmount })
      });
      if (res.ok) {
        const reloadRes = await fetch(`/api/smart-card/${card.cardNumber}`);
        if (reloadRes.ok) {
          const updatedCard = await reloadRes.json();
          setCard(updatedCard);
          await fetchUserCards();
          alert(`Successfully topped up ₹${finalAmount} to your Namma Smart Card!`);
        }
      }
    } catch (err) {
      console.error("Error topping up card:", err);
    } finally {
      setShowPayment(false);
      setCustomAmount('');
      setTopUpAmount(200);
    }
  };

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="smartcard-management-module">
      
      {}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Check Balance and Top-Up</h3>
        
        {/* If logged in and has cards, show selector */}
        {userMobile && userCards.length > 0 && (
          <div className="space-y-1.5 pb-2">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Linked Card</span>
            <select
              value={card?.cardNumber || ''}
              onChange={async (e) => {
                const selectedNo = e.target.value;
                if (selectedNo) {
                  setSearchError(null);
                  try {
                    const res = await fetch(`/api/smart-card/${selectedNo}`);
                    if (res.ok) {
                      const data = await res.json();
                      setCard(data);
                      setQueryNumber(selectedNo);
                    }
                  } catch (err) {
                    setSearchError('Error loading card details.');
                  }
                } else {
                  setCard(null);
                  setQueryNumber('');
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2.5 text-sm focus:outline-hidden"
            >
              <option value="">-- Choose a Smart Card --</option>
              {userCards.map((c) => (
                <option key={c.cardNumber} value={c.cardNumber}>
                  {c.holderName} ({c.cardNumber}) - ₹{c.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Smart Card Number (e.g. NMC-XXXX)"
            value={queryNumber}
            onChange={(e) => setQueryNumber(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleCheckBalance}
            className="px-4 py-2 bg-slate-150 text-slate-950 font-bold rounded-lg cursor-pointer text-sm shrink-0"
          >
            Check Balance and Top-Up
          </button>
        </div>

        {searchError && (
          <p className="text-sm text-red-400">{searchError}</p>
        )}
      </div>

      {card ? (
        <div className="space-y-5">
          {}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5">
            <div className="space-y-1.5 text-base text-slate-400">
              <div>
                <span>Card Holder: </span>
                <strong className="text-slate-200">{card.holderName}</strong>
              </div>
              {card.mobileNumber && (
                <div>
                  <span>Linked Mobile: </span>
                  <strong className="text-slate-200 font-mono">+91 {card.mobileNumber}</strong>
                </div>
              )}
              <div>
                <span>Card Serial Reference: </span>
                <strong className="text-slate-200 font-mono">{card.cardNumber}</strong>
              </div>
              <div>
                <span>Current Balance: </span>
                <strong className="text-slate-200 font-mono">₹{card.balance.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Top-Up Amount</span>
              <strong className="text-slate-200 font-mono text-lg">₹{customAmount ? customAmount : topUpAmount}</strong>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[100, 200, 500, 1000].map((amt) => (
                <button
                  key={`preset-${amt}`}
                  type="button"
                  onClick={() => { setTopUpAmount(amt); setCustomAmount(''); }}
                  className={`py-2 px-1 rounded-lg text-sm font-bold font-mono transition cursor-pointer border ${
                    topUpAmount === amt && !customAmount
                      ? 'bg-slate-150 text-slate-950 border-slate-700'
                      : 'bg-slate-950 text-slate-450 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">₹</span>
              <input
                type="text"
                placeholder="Or enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setCustomAmount(val);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-100 rounded-lg p-2.5 pl-7 focus:outline-hidden"
              />
            </div>

            <button
              type="button"
              onClick={handleTopUpTrigger}
              className="w-full py-2.5 bg-slate-150 text-slate-950 font-bold uppercase rounded-lg transition cursor-pointer"
            >
              Top-Up Card
            </button>
          </div>
        </div>
      ) : (
        /* If no card has been queried yet, offer to generate one - mobile authentication is required */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-200">Generate Virtual Smart Card</h3>
          
          {userMobile ? (
            /* Authenticated Generation step */
            <form onSubmit={handleCreateCardSubmit} className="space-y-4">
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-xs text-slate-400 flex items-center justify-between">
                <span>Mobile: <strong className="text-emerald-400 font-mono">+91 {userMobile}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setUserMobile(null);
                    // Also clear local inputs
                    setMobileNumber('');
                    setOtpCode('');
                    setGeneratedOtp(null);
                    setIsOtpSent(false);
                    setAuthError(null);
                  }}
                  className="text-[10px] text-red-400 hover:underline cursor-pointer"
                >
                  Logout
                </button>
              </div>

              <input
                type="text"
                placeholder="Cardholder's Full Name"
                value={newHolderName}
                onChange={(e) => setNewHolderName(e.target.value)}
                maxLength={25}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-hidden"
              />

              <button
                type="submit"
                disabled={!newHolderName.trim()}
                className="w-full py-2.5 bg-slate-150 text-slate-950 font-bold uppercase rounded-lg cursor-pointer transition-all disabled:opacity-50 text-xs"
              >
                Generate Card
              </button>
            </form>
          ) : (
            /* Unauthenticated state: display warning and the mobile OTP flow inline */
            <div className="space-y-4">
              {!isOtpSent ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-450">Mobile registration required:</div>
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
          )}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        amount={customAmount ? parseInt(customAmount) : topUpAmount}
        purpose="SMART CARD TOP-UP"
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
      />
    </div>
  );
}
