import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2, CreditCard, QrCode, Building, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  amount: number;
  purpose: string;
  onSuccess: (method: string) => void;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, amount, purpose, onSuccess, onClose }: PaymentModalProps) {
  const [activeMethod, setActiveMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const qrPayload = JSON.stringify({
    app: 'SmartMetro',
    type: 'demo-payment',
    purpose,
    amount: Number(amount.toFixed(2)),
    currency: 'INR',
  });

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    if (activeMethod === 'card') {
      if (!cardNumber || !cardHolder || !expiry || !cvv) {
        setErrorMsg('Please enter all credit/debit card fields.');
        return;
      }
    }
    
    setErrorMsg('');
    setIsProcessing(true);
    
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onSuccess(activeMethod.toUpperCase());
        resetStates();
      }, 1800);
    }, 2000);
  };

  const resetStates = () => {
    setActiveMethod('upi');
    setIsProcessing(false);
    setIsSuccess(false);
    setErrorMsg('');
    setCardNumber('');
    setCardHolder('');
    setExpiry('');
    setCvv('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100"
          id="payment-modal-container"
        >
          {}
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <div>
              <h3 className="font-sans font-semibold text-xl text-slate-100">Payment Gateway</h3>
            </div>
            <button
              onClick={() => { resetStates(); onClose(); }}
              disabled={isProcessing || isSuccess}
              className="p-1 px-2 rounded-lg text-slate-450 hover:bg-slate-850 hover:text-slate-100 transition-colors"
              id="close-payment-btn"
            >
              <X size={18} />
            </button>
          </div>

          {}
          <div className="p-4 mx-5 my-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex justify-between items-center">
            <div>
              <span className="text-sm text-slate-450 uppercase tracking-widest">{purpose}</span>
              <p className="text-base font-medium text-slate-200 mt-1">Bangalore Metro</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-450">Total Payable</span>
              <p className="text-3xl font-bold font-mono text-purple-400">₹{amount.toFixed(2)}</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-5 pt-1">
            {!isSuccess ? (
              <>
                {/* Payment Option Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    onClick={() => setActiveMethod('upi')}
                    disabled={isProcessing}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      activeMethod === 'upi'
                        ? 'border-slate-700 bg-slate-850 text-slate-100 shadow-sm'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-100 hover:border-slate-700'
                    }`}
                    id="upi-payment-tab"
                  >
                    <QrCode size={20} className="mb-1" />
                    <span className="text-sm font-medium">BHIM UPI</span>
                  </button>

                  <button
                    onClick={() => setActiveMethod('card')}
                    disabled={isProcessing}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      activeMethod === 'card'
                        ? 'border-slate-700 bg-slate-850 text-slate-100 shadow-sm'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-100 hover:border-slate-700'
                    }`}
                    id="card-payment-tab"
                  >
                    <CreditCard size={20} className="mb-1" />
                    <span className="text-sm font-medium">Card Pay</span>
                  </button>

                  <button
                    onClick={() => setActiveMethod('netbanking')}
                    disabled={isProcessing}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      activeMethod === 'netbanking'
                        ? 'border-slate-700 bg-slate-850 text-slate-100 shadow-sm'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-100 hover:border-slate-700'
                    }`}
                    id="nb-payment-tab"
                  >
                    <Building size={20} className="mb-1" />
                    <span className="text-sm font-medium">NetBanking</span>
                  </button>
                </div>

                {/* Tab Input Panels */}
                <div className="bg-slate-950/80 p-4 border border-slate-800/80 rounded-xl mb-4 min-h-[170px] flex flex-col justify-center">
                  
                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="mb-3 p-2.5 bg-red-950/40 border border-red-900/60 rounded-lg text-sm text-red-400 flex items-center">
                      <AlertCircle size={14} className="mr-2 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {activeMethod === 'upi' && (
                    <div className="text-center flex flex-col items-center">
                      {/* Scannable demo QR with payment details only */}
                      <div className="relative p-2 bg-white rounded-lg inline-block shadow-lg mb-3">
                        <QRCodeSVG value={qrPayload} size={144} level="M" marginSize={4} />
                      </div>
                      
                      <p className="text-sm text-slate-300 font-sans font-medium">Scan to view demo payment details</p>
                      <p className="text-xs text-slate-400 font-mono mt-1.5 font-semibold">
                        Demo only · no payment is collected
                      </p>
                    </div>
                  )}

                  {activeMethod === 'card' && (
                    <div className="space-y-3">
                      <div className="text-slate-400 text-xs uppercase font-sans font-semibold tracking-wider mb-0.5">Card Information</div>
                      <input
                        type="text"
                        placeholder="Simulated Card Number (e.g. 4111 2222)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm font-mono text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-slate-450 focus:outline-hidden"
                        id="payment-card-number"
                      />
                      <input
                        type="text"
                        placeholder="Card Holder Name"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-slate-450 focus:outline-hidden"
                        id="payment-card-name"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-center text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-slate-450 focus:outline-hidden"
                          maxLength={5}
                          id="payment-card-expiry"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-center text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-slate-450 focus:outline-hidden"
                          maxLength={3}
                          id="payment-card-cvv"
                        />
                      </div>
                    </div>
                  )}

                  {activeMethod === 'netbanking' && (
                    <div className="space-y-3">
                      <div className="text-slate-400 text-xs uppercase font-sans font-semibold tracking-wider mb-1">Select Bank Provider</div>
                      <div className="grid grid-cols-2 gap-2">
                        {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                          <div 
                            key={bank}
                            className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center text-sm text-slate-200 cursor-pointer hover:border-slate-650 hover:bg-slate-850 transition-all flex items-center justify-center font-semibold font-sans"
                            onClick={() => handleSimulatePayment()}
                          >
                            <Building size={14} className="mr-1.5 text-slate-450" />
                            {bank}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-slate-550 text-center mt-2 italic">Clicking any bank will auto-submit simulated transaction.</div>
                    </div>
                  )}

                </div>

                <div className="mb-4" />

                {/* Pay Trigger Button */}
                {activeMethod !== 'netbanking' && (
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full relative py-3.5 rounded-xl font-sans font-bold text-base bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    id="trigger-payment-btn"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processing Wallet...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ₹{amount.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                )}
              </>
            ) : (
              // Success Screen state
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
                id="payment-success-screen"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border-2 border-emerald-500/30 text-emerald-400"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                
                <h4 className="text-xl font-sans font-bold text-slate-100 mb-1.5">Payment Successful</h4>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
