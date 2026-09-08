import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { EnrichedComplaint } from '../../types';
import { AlertCircle } from 'lucide-react';

export const OwnerComplaints: React.FC = () => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<EnrichedComplaint[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const flats = storage.getEnrichedFlats().filter((f) => f.owner_id === currentUser.id);
    const flatIds = new Set(flats.map((f) => f.id));

    const allComplaints = storage.getEnrichedComplaints();
    setComplaints(allComplaints.filter((c) => c.flat_id && flatIds.has(c.flat_id)));
  }, [currentUser]);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Complaints Regarding Your Units</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Issues reported by tenants or society management for units under your ownership.
        </p>
      </div>

      <div className="space-y-3">
        {complaints.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
            No active maintenance complaints for your properties.
          </div>
        ) : (
          complaints.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusBadge status={c.status} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {c.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">Flat {c.flat_number}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">Reported by {c.creator_name}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{c.description}</p>

                  {c.resolution_notes && (
                    <div className="mt-2.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                      <strong>Resolution:</strong> {c.resolution_notes}
                    </div>
                  )}
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 block mt-0.5">
                    {c.worker_name ? `Assigned to ${c.worker_name}` : 'Unassigned'}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
