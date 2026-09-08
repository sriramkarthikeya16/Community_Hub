import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { User, Home, Phone, Mail, ShieldAlert, KeyRound } from 'lucide-react';

export const TenantProfile: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const flats = storage.getEnrichedFlats();
  const myFlat = flats.find((f) => f.tenant_id === currentUser.id || f.tenant?.id === currentUser.id);

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Resident Profile & Tenancy</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Your residential lease terms, flat specifications, and designated emergency points of contact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info */}
        <Card>
          <CardHeader title="Personal Details" subtitle="Verified identity on CommunityHub" />
          <div className="flex items-center gap-4 mb-4">
            <img
              src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full border border-slate-200 object-cover bg-slate-100"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Resident Tenant
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{currentUser.phone}</span>
            </div>
          </div>
        </Card>

        {/* Assigned Flat & Landlord */}
        <Card>
          <CardHeader title="Leased Property" subtitle="Designated apartment unit" />
          {myFlat ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-base font-bold text-slate-900 block">
                  Flat {myFlat.flat_number}
                </span>
                <span className="text-slate-500 block mt-0.5">
                  {myFlat.building_name} • Floor {myFlat.floor_number} • {myFlat.flat_type} (
                  {myFlat.area_sqft} sq.ft)
                </span>
              </div>

              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Monthly Base Rent:</span>
                  <span className="font-bold text-slate-900">
                    ₹{myFlat.rent_amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Society Maintenance:</span>
                  <span className="font-semibold text-slate-800">
                    ₹{myFlat.maintenance_amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {myFlat.owner && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
                    Property Owner / Landlord:
                  </span>
                  <div className="text-xs text-slate-800 font-semibold">{myFlat.owner.name}</div>
                  <div className="text-[11px] text-slate-500">{myFlat.owner.phone} • {myFlat.owner.email}</div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No flat linked to this account.</p>
          )}
        </Card>
      </div>

      {/* Emergency Contacts Card */}
      <Card>
        <CardHeader
          title="Community Emergency Directory"
          subtitle="Essential numbers for instant resident escalation"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-900 block">Main Gate Security</span>
            <span className="text-sm font-mono font-bold text-blue-600 block mt-1">+91 80 4455 0001</span>
            <span className="text-[10px] text-slate-400">Available 24/7 at Entrance</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-900 block">Estate Office & Helpdesk</span>
            <span className="text-sm font-mono font-bold text-blue-600 block mt-1">+91 80 4455 0002</span>
            <span className="text-[10px] text-slate-400">9:00 AM – 7:00 PM Daily</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-900 block">Emergency Water / DG Control</span>
            <span className="text-sm font-mono font-bold text-rose-600 block mt-1">+91 80 4455 0009</span>
            <span className="text-[10px] text-slate-400">Immediate Power/Water Failure</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
