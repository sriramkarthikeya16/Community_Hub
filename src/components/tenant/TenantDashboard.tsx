import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { PaymentModal } from '../common/PaymentModal';
import { ReceiptModal } from '../common/ReceiptModal';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import {
  Home,
  Receipt,
  CreditCard,
  AlertCircle,
  Megaphone,
  CheckCircle,
  Plus,
  ArrowRight,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { EnrichedFlat, EnrichedBill, EnrichedComplaint, Payment } from '../../types';

interface TenantDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewComplaint: () => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({
  onNavigateTab,
  onOpenNewComplaint,
}) => {
  const { currentUser } = useAuth();
  const [myFlat, setMyFlat] = useState<EnrichedFlat | null>(null);
  const [bills, setBills] = useState<EnrichedBill[]>([]);
  const [complaints, setComplaints] = useState<EnrichedComplaint[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Payment Checkout Modal
  const [payingBill, setPayingBill] = useState<EnrichedBill | null>(null);

  // Receipt Modal
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const refresh = () => {
      const allFlats = storage.getEnrichedFlats();
      const flat = allFlats.find((f) => f.tenant_id === currentUser.id || f.tenant?.id === currentUser.id);
      setMyFlat(flat || null);

      if (flat) {
        const allBills = storage.getEnrichedBills();
        setBills(allBills.filter((b) => b.flat_id === flat.id));

        const allComplaints = storage.getEnrichedComplaints();
        setComplaints(allComplaints.filter((c) => c.flat_id === flat.id));

        const allPayments = storage.getPayments();
        setPayments(allPayments.filter((p) => p.user_id === currentUser.id));
      }
    };

    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [currentUser]);

  const pendingBills = bills.filter((b) => b.status === 'PENDING' || b.status === 'OVERDUE');
  const rentBill = pendingBills.find((b) => b.bill_type === 'RENT');
  const openComplaints = complaints.filter(
    (c) => c.status !== 'Resolved' && c.status !== 'Closed' && c.status !== 'Rejected'
  );

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: Residence Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60 mb-1.5">
            <Home className="w-3.5 h-3.5" />
            <span>Resident Tenant Portal</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Hello, {currentUser?.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {myFlat ? (
              <>
                Flat <strong>{myFlat.flat_number}</strong> • {myFlat.building_name}, Floor {myFlat.floor_number} (
                {myFlat.flat_type})
              </>
            ) : (
              'Grand Palms Residency'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<AlertCircle className="w-4 h-4" />}
            onClick={onOpenNewComplaint}
          >
            Report Issue
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Receipt className="w-4 h-4" />}
            onClick={() => onNavigateTab('rent-bills')}
          >
            View All Bills
          </Button>
        </div>
      </div>

      {/* Primary Rent Due Banner if Rent is pending */}
      {rentBill && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200 block mb-1">
              Upcoming Rent Obligation
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">₹{rentBill.amount.toLocaleString('en-IN')}</span>
              <span className="text-blue-100 text-xs">Due by {rentBill.due_date}</span>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Monthly rent for Flat {myFlat?.flat_number} ({rentBill.billing_period_start} to{' '}
              {rentBill.billing_period_end})
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            className="bg-white text-blue-700 hover:bg-blue-50 border-none font-bold"
            leftIcon={<CreditCard className="w-4 h-4 text-blue-600" />}
            onClick={() => setPayingBill(rentBill)}
          >
            Pay Rent Now
          </Button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card hoverable onClick={() => onNavigateTab('rent-bills')} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unpaid Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{pendingBills.length}</span>
            <div className="text-xs text-amber-600 font-medium mt-1">
              ₹{pendingBills.reduce((s, b) => s + b.amount, 0).toLocaleString('en-IN')} total due
            </div>
          </div>
        </Card>

        <Card hoverable onClick={() => onNavigateTab('complaints')} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Requests</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{openComplaints.length}</span>
            <div className="text-xs text-slate-500 mt-1">Maintenance tickets</div>
          </div>
        </Card>

        <Card hoverable onClick={() => onNavigateTab('payments')} className="cursor-pointer col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Receipts</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{payments.length}</span>
            <div className="text-xs text-emerald-600 font-medium mt-1">Settled payments</div>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Pending Utility & Common Bills vs Active Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Bills */}
        <Card>
          <CardHeader
            title="Pending Bills & Due Notices"
            subtitle="Electricity, water allocation, and maintenance charges"
            action={
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => onNavigateTab('rent-bills')}
              >
                View all
              </Button>
            }
          />

          <div className="divide-y divide-slate-100">
            {pendingBills.length === 0 ? (
              <div className="py-8 text-center text-xs text-emerald-600 font-medium flex flex-col items-center gap-1">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>All caught up! No outstanding dues for Flat {myFlat?.flat_number}.</span>
              </div>
            ) : (
              pendingBills.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {b.bill_type.replace('_', ' ')}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                    <span className="text-[11px] text-slate-500">Due by {b.due_date}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 block">
                      ₹{b.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => setPayingBill(b)}
                      className="text-xs text-blue-600 font-semibold hover:underline mt-1"
                    >
                      Pay Now →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Maintenance Requests Progress */}
        <Card>
          <CardHeader
            title="My Maintenance Requests"
            subtitle="Real-time dispatch and repair updates"
            action={
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={onOpenNewComplaint}
              >
                New Request
              </Button>
            }
          />

          <div className="divide-y divide-slate-100">
            {complaints.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                No active complaints filed for this flat.
              </p>
            ) : (
              complaints.slice(0, 3).map((c) => (
                <div key={c.id} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{c.title}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{c.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {c.worker_name ? `Assigned: ${c.worker_name} (${c.worker_type})` : 'Awaiting worker dispatch'}
                    </span>
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Community Notices Feed */}
      <Card>
        <CardHeader
          title="Grand Palms Notices"
          subtitle="Recent announcements from society management"
          action={
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => onNavigateTab('announcements')}
            >
              Bulletin board
            </Button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storage.getAnnouncements().slice(0, 2).map((ann) => (
            <div key={ann.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  {ann.category}
                </span>
                <StatusBadge status={ann.priority} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {ann.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Modal */}
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
