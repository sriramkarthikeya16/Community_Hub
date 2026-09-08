import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { ReceiptModal } from '../common/ReceiptModal';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { EnrichedBill, Payment } from '../../types';
import { Receipt, CreditCard, Printer, CheckCircle } from 'lucide-react';

export const OwnerBillsAndCollections: React.FC = () => {
  const { currentUser } = useAuth();
  const [bills, setBills] = useState<EnrichedBill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const flats = storage.getEnrichedFlats().filter((f) => f.owner_id === currentUser.id);
    const flatIds = new Set(flats.map((f) => f.id));

    const allBills = storage.getEnrichedBills();
    setBills(allBills.filter((b) => b.flat_id && flatIds.has(b.flat_id)));
    setPayments(storage.getPayments());
  }, [currentUser]);

  const rentBills = bills.filter((b) => b.bill_type === 'RENT');
  const maintBills = bills.filter((b) => b.bill_type !== 'RENT');

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Rent Collections & Society Dues</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitor tenant rent collection receipts and society maintenance dues for your properties.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Flat & Bill</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Payer / Tenant</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No billing records found for your properties.
                  </td>
                </tr>
              ) : (
                bills.map((b) => {
                  const payment = payments.find((p) => p.bill_id === b.id && p.status === 'SUCCESS');
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 text-sm block">{b.title}</span>
                        <span className="text-[11px] text-slate-500">Flat {b.flat_number}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-bold">
                          {b.bill_type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {b.recipient_name}
                      </td>

                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {b.due_date}
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-900 text-sm">
                        ₹{b.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={b.status} />
                      </td>

                      <td className="px-4 py-3 text-right">
                        {payment ? (
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Unsettled</span>
                        )}
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
