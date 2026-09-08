import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { ReceiptModal } from '../common/ReceiptModal';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { Payment, Bill } from '../../types';
import { CreditCard, Printer, CheckCircle } from 'lucide-react';

export const TenantPaymentHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const refresh = () => {
      const allPayments = storage.getPayments();
      setPayments(allPayments.filter((p) => p.user_id === currentUser.id));
      setBills(storage.getBills());
    };

    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [currentUser]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Payment & Escrow Receipts</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          History of all settled rent, utility bills, and society fee payments with official digital receipts.
        </p>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Invoice Paid</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Channel / Gateway</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No payment history recorded for this account.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const bill = bills.find((b) => b.id === p.bill_id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {p.transaction_id}
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 block">{bill?.title || 'Bill Payment'}</span>
                        <span className="text-[11px] text-slate-400">Ref: {p.bill_id.slice(-8)}</span>
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-900 text-sm">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {p.payment_method_title || p.payment_provider}
                      </td>

                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {p.payment_date
                          ? new Date(p.payment_date).toLocaleDateString('en-IN', {
                              dateStyle: 'medium',
                            })
                          : 'Pending'}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptModal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
    </div>
  );
};
