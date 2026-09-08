import React from 'react';
import { useAuth } from '../../services/authContext';
import { Button } from '../ui/Button';
import {
  Building2,
  Shield,
  KeyRound,
  Home,
  Wrench,
  Receipt,
  CreditCard,
  AlertCircle,
  Megaphone,
  Store,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onSelectRole,
}) => {
  const { loginAsRole } = useAuth();

  const handlePersonaLaunch = (role: UserRole) => {
    loginAsRole(role);
    onSelectRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Community<span className="text-blue-600">Hub</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Residential Management System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onOpenLogin}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={onOpenRegister}>
              Register Flat
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/80 mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>One platform to manage your entire residential community</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Modern, Transparent Living for Apartments & Gated Societies
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Eliminate fragmented WhatsApp chats and manual paper receipts. Connect administrators, owners,
          tenants, and maintenance workers through one digital hub.
        </p>

        {/* Persona Quick Launch Interactive Sandbox */}
        <div className="mt-10 p-6 bg-white rounded-2xl border border-slate-200 shadow-md max-w-4xl mx-auto text-left">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Interactive Evaluation</h3>
              <p className="text-xs text-slate-500">
                Select any persona below to instantly experience their dedicated workspace:
              </p>
            </div>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
              4 Roles Configured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Admin */}
            <div
              onClick={() => handlePersonaLaunch('ADMIN')}
              className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Administrator</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Flats, owners, billing splits, complaints assignment & audit log.
              </p>
              <span className="text-[10px] font-semibold text-rose-700 block mt-2">
                Login as Sarah Connor →
              </span>
            </div>

            {/* Owner */}
            <div
              onClick={() => handlePersonaLaunch('OWNER')}
              className="p-4 rounded-xl border border-purple-200/80 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Property Owner</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Monitor owned units (A-301 & B-502), tenants, and rent collections.
              </p>
              <span className="text-[10px] font-semibold text-purple-700 block mt-2">
                Login as Rajesh Kumar →
              </span>
            </div>

            {/* Tenant */}
            <div
              onClick={() => handlePersonaLaunch('TENANT')}
              className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Home className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Tenant Resident</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                View rent, pay bills online, track complaints, read notices.
              </p>
              <span className="text-[10px] font-semibold text-blue-700 block mt-2">
                Login as Emily Watson →
              </span>
            </div>

            {/* Worker */}
            <div
              onClick={() => handlePersonaLaunch('WORKER')}
              className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Service Worker</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Assigned task queue, status updater, resolution notes, and shift logs.
              </p>
              <span className="text-[10px] font-semibold text-amber-700 block mt-2">
                Login as David Vance →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-12 bg-white border-t border-slate-200/80 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Complete Community Management Ecosystem</h2>
            <p className="text-xs text-slate-500 mt-1">
              Everything required to operate an apartment complex with 100% auditable digital records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Rent & Utility Billing</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Automated rent tracking, individual sub-meter electricity/water bills, and common society expense
                allocations (Equal or Area-based sqft calculation).
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Verified Online Payments</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Secure escrow checkout via UPI, NetBanking, and Card. Server-verified transaction settlement with
                instant printable digital receipts.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Complaint Lifecycle & Dispatch</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Residents raise maintenance tickets. Admins dispatch qualified community plumbers or electricians.
                Workers update real-time progress until resolution.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Official Notices & Alerts</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Centralized announcement board for generator maintenance, water shutdowns, AGMs, and emergency security
                alerts with priority badges.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Nearby Services Directory</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Vetted directory of nearby plumbers, electricians, maids, chefs, laundry services, and water tanker
                suppliers with direct phone contacts.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Immutable Audit Trail</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Every flat allocation, bill creation, payment settlement, and complaint status shift is permanently
                logged for association governance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500 bg-white">
        <p>© 2026 CommunityHub. Master Product Specification v1.0. Grand Palms Residency.</p>
      </footer>
    </div>
  );
};
