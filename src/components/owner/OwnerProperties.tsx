import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { EnrichedFlat } from '../../types';
import { Building, Phone, Mail, User, Layers } from 'lucide-react';

export const OwnerProperties: React.FC = () => {
  const { currentUser } = useAuth();
  const [flats, setFlats] = useState<EnrichedFlat[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const refresh = () => {
      const allFlats = storage.getEnrichedFlats();
      setFlats(allFlats.filter((f) => f.owner_id === currentUser.id || f.owner?.id === currentUser.id));
    };
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [currentUser]);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Properties & Units</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Detailed registry of your owned apartments, lease terms, and tenant occupancy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flats.map((flat) => (
          <Card key={flat.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-lg font-extrabold text-slate-900 block">
                    Flat {flat.flat_number}
                  </span>
                  <span className="text-xs text-slate-500">
                    {flat.building_name} • Floor {flat.floor_number}
                  </span>
                </div>
                <StatusBadge status={flat.occupancy_status} />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mt-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">Apartment Type</span>
                  <span className="font-semibold text-slate-900">{flat.flat_type}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Super Built-up Area</span>
                  <span className="font-semibold text-slate-900">{flat.area_sqft} sq.ft</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Standard Rent Yield</span>
                  <span className="font-bold text-slate-900">
                    ₹{flat.rent_amount.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Society Maintenance</span>
                  <span className="font-semibold text-slate-700">
                    ₹{flat.maintenance_amount.toLocaleString('en-IN')}/mo
                  </span>
                </div>
              </div>

              {/* Tenant Section */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Active Tenant Information
                </span>
                {flat.tenant ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        flat.tenant.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${flat.tenant.name}`
                      }
                      alt={flat.tenant.name}
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover bg-slate-100"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">{flat.tenant.name}</span>
                      <span className="text-slate-500">{flat.tenant.phone} • {flat.tenant.email}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block font-medium">
                    Vacant Unit — Available for Lease
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
