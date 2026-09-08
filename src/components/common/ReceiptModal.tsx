import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Payment, Bill, Flat, User } from '../../types';
import { storage } from '../../services/storage';
import { Download, Printer, CheckCircle, Building2 } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  bill?: Bill | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  bill,
}) => {
  if (!payment) return null;

  const resolvedBill = bill || storage.getBills().find((b) => b.id === payment.bill_id);
  const community = storage.getCommunity();
  const user = storage.getUser(payment.user_id);
  const flat = resolvedBill?.flat_id ? storage.getFlats().find((f) => f.id === resolvedBill.flat_id) : null;
  const building = flat ? storage.getBuildings().find((b) => b.id === flat.building_id) : null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = payment.payment_date
    ? new Date(payment.payment_date).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleDateString();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Receipt" maxWidth="lg">
      <div id="printable-receipt" className="p-2 text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{community.name}</h2>
              <p className="text-xs text-slate-500">{community.address}, {community.city}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> PAID
            </span>
            <p className="text-xs text-slate-400 mt-1">Receipt: #{payment.transaction_id.slice(-6)}</p>
          </div>
        </div>

        {/* Transaction Summary Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs mb-4">
          <div>
            <span className="text-slate-400 block font-medium">Transaction ID</span>
            <span className="font-mono font-bold text-slate-800">{payment.transaction_id}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Payment Date & Time</span>
            <span className="font-medium text-slate-800">{formattedDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Resident / Payee</span>
            <span className="font-medium text-slate-800">{user?.name || 'Resident Occupant'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Property / Unit</span>
            <span className="font-medium text-slate-800">
              {flat ? `${flat.flat_number} (${building?.name || 'Wing'})` : 'Community General'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Payment Channel</span>
            <span className="font-medium text-slate-800">{payment.payment_method_title || payment.payment_provider}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Gateway Reference</span>
            <span className="font-mono text-slate-600">{payment.provider_reference || 'REF_INSTANT_SETTLE'}</span>
          </div>
        </div>

        {/* Bill Items Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Billing Period</th>
                <th className="px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-2.5">
                  <p className="font-semibold text-slate-800">{resolvedBill?.title || 'Community Assessment'}</p>
                  <p className="text-slate-500 text-[11px]">{resolvedBill?.description}</p>
                </td>
                <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                  {resolvedBill ? `${resolvedBill.billing_period_start} to ${resolvedBill.billing_period_end}` : 'Current Cycle'}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold text-slate-900">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
              <tr>
                <td colSpan={2} className="px-3 py-2.5 text-right">Total Paid (INR):</td>
                <td className="px-3 py-2.5 text-right text-sm text-blue-600">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Verification Note */}
        <div className="bg-blue-50/70 border border-blue-200/60 rounded-lg p-3 text-[11px] text-blue-800 mb-4 flex items-center justify-between">
          <span>This is an official system-generated digital receipt. No signature required.</span>
          <span className="font-semibold text-blue-900">Audited by CommunityHub</span>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print Receipt
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
