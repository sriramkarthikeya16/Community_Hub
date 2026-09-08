import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import {
  Building,
  KeyRound,
  Users,
  Receipt,
  CreditCard,
  AlertCircle,
  Megaphone,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { EnrichedFlat, EnrichedBill, EnrichedComplaint, Payment } from '../../types';

interface OwnerDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const [myFlats, setMyFlats] = useState<EnrichedFlat[]>([]);
  const [bills, setBills] = useState<EnrichedBill[]>([]);
  const [complaints, setComplaints] = useState<EnrichedComplaint[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const refresh = () => {
      const allFlats = storage.getEnrichedFlats();
      const owned = allFlats.filter((f) => f.owner_id === currentUser.id || f.owner?.id === currentUser.id);
      setMyFlats(owned);

      const ownedFlatIds = new Set(owned.map((f) => f.id));
      const allBills = storage.getEnrichedBills();
      setBills(allBills.filter((b) => b.flat_id && ownedFlatIds.has(b.flat_id)));

      const allComplaints = storage.getEnrichedComplaints();
      setComplaints(allComplaints.filter((c) => c.flat_id && ownedFlatIds.has(c.flat_id)));

      const allPayments = storage.getPayments();
      setPayments(allPayments);
    };

    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [currentUser]);

  const totalOwned = myFlats.length;
  const occupiedCount = myFlats.filter((f) => f.occupancy_status === 'OCCUPIED').length;
  const totalMonthlyRental = myFlats.reduce((sum, f) => sum + f.rent_amount, 0);

  const pendingBills = bills.filter((b) => b.status === 'PENDING' || b.status === 'OVERDUE');
  const pendingAmount = pendingBills.reduce((sum, b) => sum + b.amount, 0);

  const openComplaints = complaints.filter(
    (c) => c.status !== 'Resolved' && c.status !== 'Closed' && c.status !== 'Rejected'
  );

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200/60 mb-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Property Owner Portfolio</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Welcome back, {currentUser?.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            You hold title to {totalOwned} apartment units in Grand Palms Residency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('properties')}
          >
            View Properties
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateTab('bills')}
          >
            Rent & Collections
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable onClick={() => onNavigateTab('properties')} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Properties</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{totalOwned}</span>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              {occupiedCount} Occupied ({totalOwned - occupiedCount} Vacant)
            </div>
          </div>
        </Card>

        <Card hoverable onClick={() => onNavigateTab('bills')} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Monthly Rent</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">
              ₹{totalMonthlyRental.toLocaleString('en-IN')}
            </span>
            <div className="text-xs text-slate-500 mt-1">Expected monthly yield</div>
          </div>
        </Card>

        <Card hoverable onClick={() => onNavigateTab('bills')} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Dues</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </span>
            <div className="text-xs text-amber-600 font-medium mt-1">
              {pendingBills.length} unpaid flat invoices
            </div>
          </div>
        </Card>

        <Card hoverable onClick={() => onNavigateTab('complaints')} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unit Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{openComplaints.length}</span>
            <div className="text-xs text-slate-500 mt-1">Active repair requests</div>
          </div>
        </Card>
      </div>

      {/* Owned Properties List */}
      <Card>
        <CardHeader
          title="My Units Portfolio"
          subtitle="Status of your owned properties, tenants, and lease conditions"
          action={
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              onClick={() => onNavigateTab('properties')}
            >
              Details
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myFlats.map((flat) => (
            <div
              key={flat.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-slate-900">Flat {flat.flat_number}</span>
                  <StatusBadge status={flat.occupancy_status} />
                </div>
                <p className="text-xs text-slate-500">
                  {flat.building_name} • Floor {flat.floor_number} • {flat.flat_type} ({flat.area_sqft} sq.ft)
                </p>

                <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resident Tenant:</span>
                    <span className="font-semibold text-slate-900">
                      {flat.tenant ? flat.tenant.name : 'Currently Vacant'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Rent:</span>
                    <span className="font-bold text-slate-900">
                      ₹{flat.rent_amount.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Society Maintenance:</span>
                    <span className="text-slate-700">
                      ₹{flat.maintenance_amount.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
