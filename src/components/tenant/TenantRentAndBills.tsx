import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { PaymentModal } from '../common/PaymentModal';
import { ReceiptModal } from '../common/ReceiptModal';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { EnrichedBill, Payment } from '../../types';
import { Receipt, CreditCard, CheckCircle, Clock, Printer } from 'lucide-react';

export const TenantRentAndBills: React.FC = () => {
  const { currentUser } = useAuth();
  const [bills, setBills] = useState<EnrichedBill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Modals
  const [payingBill, setPayingBill] = useState<EnrichedBill | null>(null);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const refresh = () => {
    if (!currentUser) return;
    const flats = storage.getEnrichedFlats();
    const myFlat = flats.find((f) => f.tenant_id === currentUser.id || f.tenant?.id === currentUser.id);

    if (myFlat) {
      const allBills = storage.getEnrichedBills();
      setBills(allBills.filter((b) => b.flat_id === myFlat.id));

      const allPayments = storage.getPayments();
      setPayments(allPayments.filter((p) => p.user_id === currentUser.id));
    }
  };

  useEffect(() => {
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [currentUser]);

  const handleOpenReceiptForBill = (bill: EnrichedBill) => {
    const payment = payments.find((p) => p.bill_id === bill.id && p.status === 'SUCCESS');
    if (payment) {
      setReceiptPayment(payment);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Rent & Utility Invoices</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review individual rent, sub-meter electric, and allocated common community expenses.
        </p>
      </div>

      {/* Bills Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Invoice Details</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Billing Cycle</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Total (INR)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No bills issued to your flat.
                  </td>
                </tr>
              ) : (
                bills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 text-sm block">{b.title}</span>
                      {b.description && (
                        <span className="text-[11px] text-slate-500 line-clamp-1">{b.description}</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">
                        {b.bill_type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {b.billing_period_start} to {b.billing_period_end}
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                      {b.due_date}
                    </td>

                    <td className="px-4 py-3 font-bold text-slate-900 text-sm">
                      ₹{b.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>

                    <td className="px-4 py-3 text-right">
                      {b.status !== 'PAID' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                          onClick={() => setPayingBill(b)}
                        >
                          Pay Now
                        </Button>
                      ) : (
                        <button
                          onClick={() => handleOpenReceiptForBill(b)}
                          className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Checkout Modal */}
      {payingBill && (
        <PaymentModal
          isOpen={!!payingBill}
          onClose={() => setPayingBill(null)}
          bill={payingBill}
          onPaymentSuccess={(payment) => {
            setPayingBill(null);
            setReceiptPayment(payment);
          }}
        />
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={!!receiptPayment}
        onClose={() => setReceiptPayment(null)}
        payment={receiptPayment}
      />
    </div>
  );
};
