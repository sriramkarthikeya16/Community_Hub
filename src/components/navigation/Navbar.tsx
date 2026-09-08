import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { NotificationBell } from '../common/NotificationBell';
import { Building2, UserCog, LogOut, Menu, X, Shield, KeyRound, Wrench, Home } from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
  onNavigateHome,
}) => {
  const { currentUser, loginAsRole, logout, allUsers, switchUser } = useAuth();
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const getRoleIcon = (role?: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-3.5 h-3.5 text-rose-600" />;
      case 'OWNER':
        return <KeyRound className="w-3.5 h-3.5 text-purple-600" />;
      case 'TENANT':
        return <Home className="w-3.5 h-3.5 text-blue-600" />;
      case 'WORKER':
        return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRoleBadgeClasses = (role?: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'OWNER':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'TENANT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'WORKER':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-2xs px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 leading-none block">
                Community<span className="text-blue-600">Hub</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none block mt-0.5">
                Grand Palms Residency
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Role Switcher, Notifications, User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Banner */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-all cursor-pointer shadow-2xs"
            >
              <UserCog className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-bold text-slate-900 capitalize">{currentUser?.role.toLowerCase()}</span>
              <span className="text-[10px] text-blue-600 bg-blue-100/70 px-1 rounded">Switch</span>
            </button>

            {roleSwitcherOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 text-left"
                onClick={() => setRoleSwitcherOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Switch Testing Persona
                </div>

                <button
                  onClick={() => loginAsRole('ADMIN')}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                    currentUser?.role === 'ADMIN' ? 'bg-rose-50 font-bold text-rose-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Shield className="w-4 h-4 text-rose-600" />
                  <div>
                    <div className="leading-tight font-semibold">Admin (Sarah Connor)</div>
                    <div className="text-[10px] text-slate-400">Full community operations</div>
                  </div>
                </button>

                <button
                  onClick={() => loginAsRole('OWNER')}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                    currentUser?.role === 'OWNER' ? 'bg-purple-50 font-bold text-purple-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="leading-tight font-semibold">Owner (Rajesh Kumar)</div>
                    <div className="text-[10px] text-slate-400">Flats A-301 & B-502</div>
                  </div>
                </button>

                <button
                  onClick={() => loginAsRole('TENANT')}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                    currentUser?.role === 'TENANT' ? 'bg-blue-50 font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Home className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="leading-tight font-semibold">Tenant (Emily Watson)</div>
                    <div className="text-[10px] text-slate-400">Flat A-301 (Sunflower)</div>
                  </div>
                </button>

                <button
                  onClick={() => loginAsRole('WORKER')}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                    currentUser?.role === 'WORKER' ? 'bg-amber-50 font-bold text-amber-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Wrench className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="leading-tight font-semibold">Worker (David Vance)</div>
                    <div className="text-[10px] text-slate-400">Master Electrician</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <NotificationBell />

          {/* Active User Avatar & Role */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-slate-100"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight flex items-center gap-1">
                  {currentUser.name}
                </div>
                <div
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadgeClasses(
                    currentUser.role
                  )}`}
                >
                  {getRoleIcon(currentUser.role)}
                  <span>{currentUser.role}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
