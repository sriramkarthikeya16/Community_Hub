import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Bill, Payment } from '../../types';
import { storage } from '../../services/storage';
import { useAuth } from '../../services/authContext';
import { useToast } from '../ui/Toast';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onPaymentSuccess?: (payment: Payment) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bill,
  onPaymentSuccess,
}) => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [step, setStep] = useState<'DETAILS' | 'METHOD' | 'PROCESSING' | 'SUCCESS'>('DETAILS');
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiApp, setUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM'>('GPAY');
  const [bank, setBank] = useState('HDFC Bank');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Cardholder Name');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null);

  if (!bill) return null;

  const handleStartPayment = () => {
    setStep('METHOD');
  };

  const executePayment = async () => {
    if (!currentUser) {
      error('Authentication required', 'Please sign in to proceed with payment.');
      return;
    }

    setStep('PROCESSING');

    // Simulate multi-step payment gateway handshake & server-side verification
    setTimeout(() => {
      let methodTitle = 'UPI - Google Pay';
      let provider = 'UPI Gateway';

      if (selectedMethod === 'UPI') {
        methodTitle = `UPI (${upiApp === 'GPAY' ? 'Google Pay' : upiApp === 'PHONEPE' ? 'PhonePe' : 'Paytm'})`;
        provider = 'Razorpay / UPI';
      } else if (selectedMethod === 'CARD') {
        methodTitle = `Card ending in 4242`;
        provider = 'Stripe Secure Checkout';
      } else if (selectedMethod === 'NETBANKING') {
        methodTitle = `NetBanking (${bank})`;
        provider = 'Razorpay NetBanking';
      }

      const result = storage.processPayment(bill.id, currentUser.id, provider, methodTitle);

      if (result.success && result.payment) {
        setCompletedPayment(result.payment);
        setStep('SUCCESS');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        success('Payment Verified!', `Transaction ${result.payment.transaction_id} settled successfully.`);
        if (onPaymentSuccess) {
          onPaymentSuccess(result.payment);
        }
      } else {
        setStep('METHOD');
        error('Payment Failed', result.message || 'Unable to complete transaction. Please retry.');
      }
    }, 1600);
  };

  const handleResetAndClose = () => {
    setStep('DETAILS');
    setCompletedPayment(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={step === 'SUCCESS' ? 'Payment Confirmed' : 'Secure Payment Checkout'}
      subtitle={step === 'SUCCESS' ? 'Transaction settled and receipt generated' : 'CommunityHub Verified Escrow System'}
      maxWidth="md"
    >
      <div className="space-y-4 text-left">
        {/* Step 1: Bill Details */}
        {step === 'DETAILS' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {bill.bill_type.replace('_', ' ')}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">{bill.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{bill.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-slate-900">₹{bill.amount.toLocaleString('en-IN')}</span>
                  <p className="text-[11px] text-slate-400">Due: {bill.due_date}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
              <div className="flex justify-between">
                <span>Billing Period:</span>
                <span className="font-medium text-slate-800">{bill.billing_period_start} to {bill.billing_period_end}</span>
              </div>
              <div className="flex justify-between">
                <span>Late Fee / Penalties:</span>
                <span className="font-medium text-emerald-600">₹0 (Waived)</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 pt-1 border-t border-slate-100 text-sm">
                <span>Total Payable Amount:</span>
                <span className="text-blue-600">₹{bill.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Direct settlement to Grand Palms Resident Welfare Association Official Escrow.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleResetAndClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleStartPayment}>
                Proceed to Payment (₹{bill.amount.toLocaleString('en-IN')})
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === 'METHOD' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-lg border border-blue-200 text-xs">
              <span className="text-slate-600">Amount to pay:</span>
              <span className="text-base font-bold text-blue-700">₹{bill.amount.toLocaleString('en-IN')}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'UPI'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-current" />
                  <span className="text-xs block">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARD')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'CARD'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-current" />
                  <span className="text-xs block">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('NETBANKING')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'NETBANKING'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 mx-auto mb-1 text-current" />
                  <span className="text-xs block">NetBanking</span>
                </button>
              </div>
            </div>

            {/* Method Specific Form */}
            {selectedMethod === 'UPI' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-semibold text-slate-700 block">Choose UPI App</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['GPAY', 'PHONEPE', 'PAYTM'] as const).map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiApp(app)}
                      className={`px-3 py-2 text-xs rounded-lg border font-medium transition-all ${
                        upiApp === app
                          ? 'border-blue-600 bg-white text-blue-700 shadow-2xs font-semibold'
                          : 'border-slate-200 text-slate-600 bg-slate-100 hover:bg-white'
                      }`}
                    >
                      {app === 'GPAY' ? 'Google Pay' : app === 'PHONEPE' ? 'PhonePe' : 'Paytm'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>Instant zero-fee VPA clearance verification</span>
                </div>
              </div>
            )}

            {selectedMethod === 'CARD' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Secured by 256-bit TLS encryption. Sensitive card CVV is never stored.
                </p>
              </div>
            )}

            {selectedMethod === 'NETBANKING' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Select Bank</label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
                <p className="text-[11px] text-slate-400">You will be redirected to the secure bank portal.</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStep('DETAILS')}>
                Back
              </Button>
              <Button variant="primary" size="sm" onClick={executePayment}>
                Authorize Payment (₹{bill.amount.toLocaleString('en-IN')})
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Processing Animation */}
        {step === 'PROCESSING' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
            <div>
              <h4 className="text-base font-semibold text-slate-900">Verifying Transaction</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Connecting to payment provider, confirming account balance and recording audit proof...
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Success State */}
        {step === 'SUCCESS' && completedPayment && (
          <div className="space-y-4 py-2">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Payment Successful!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your payment of <strong className="text-slate-800">₹{completedPayment.amount.toLocaleString('en-IN')}</strong> has been confirmed.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Ref:</span>
                <span className="font-mono font-bold text-slate-800">{completedPayment.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-emerald-600">SETTLED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bill Cleared:</span>
                <span className="font-medium text-slate-800">{bill.title}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="primary" size="sm" onClick={handleResetAndClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
