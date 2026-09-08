import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { EnrichedComplaint } from '../../types';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';

export const WorkerTaskHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [completed, setCompleted] = useState<EnrichedComplaint[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const workers = storage.getWorkers();
    const w = workers.find((item) => item.user_id === currentUser.id);

    if (w) {
      const allComplaints = storage.getEnrichedComplaints();
      setCompleted(
        allComplaints.filter(
          (c) => c.assigned_worker_id === w.id && (c.status === 'Resolved' || c.status === 'Closed')
        )
      );
    }
  }, [currentUser]);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Task History & Resolution Records</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Archived log of all maintenance tickets resolved and closed by you.
        </p>
      </div>

      <div className="space-y-3">
        {completed.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
            No completed tasks in archive yet.
          </div>
        ) : (
          completed.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.status} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900">Flat {t.flat_number}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{t.description}</p>

              {t.resolution_notes && (
                <div className="mt-3 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                  <strong>Resolution:</strong> {t.resolution_notes}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
