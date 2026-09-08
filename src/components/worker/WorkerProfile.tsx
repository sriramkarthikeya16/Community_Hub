import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { useToast } from '../ui/Toast';
import { Wrench, Phone, Mail, Star, ShieldCheck } from 'lucide-react';
import { WorkerAvailability } from '../../types';

export const WorkerProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const { success } = useToast();
  if (!currentUser) return null;

  const workers = storage.getWorkers();
  const worker = workers.find((w) => w.user_id === currentUser.id);

  const handleToggleDuty = (status: WorkerAvailability) => {
    if (!worker) return;
    storage.updateWorkerAvailability(worker.id, status);
    success('Duty Updated', `Status changed to ${status}.`);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Worker Profile & Schedule</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Your active maintenance assignment, shift readiness, and service statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info */}
        <Card>
          <CardHeader title="Technician Credentials" subtitle="Assigned facility credentials" />
          <div className="flex items-center gap-4 mb-4">
            <img
              src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full border border-slate-200 object-cover bg-slate-100"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {worker?.worker_type || 'Facility Staff'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{currentUser.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-slate-800">{worker?.rating || 4.9} / 5.0 Rating</span>
            </div>
          </div>
        </Card>

        {/* Duty Status Card */}
        <Card>
          <CardHeader title="Shift Status" subtitle="Broadcast your availability to society dispatch" />
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Current Status:</span>
                <span className="text-sm font-bold text-slate-900 capitalize">
                  {worker?.availability.toLowerCase().replace('_', ' ')}
                </span>
              </div>
              <StatusBadge status={worker?.availability || 'AVAILABLE'} />
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 block mb-2">Change Duty State:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleDuty('AVAILABLE')}
                  className={`p-2 text-xs font-semibold rounded-lg border text-center cursor-pointer transition-all ${
                    worker?.availability === 'AVAILABLE'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDuty('BUSY')}
                  className={`p-2 text-xs font-semibold rounded-lg border text-center cursor-pointer transition-all ${
                    worker?.availability === 'BUSY'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 ring-1 ring-amber-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Busy
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDuty('ON_LEAVE')}
                  className={`p-2 text-xs font-semibold rounded-lg border text-center cursor-pointer transition-all ${
                    worker?.availability === 'ON_LEAVE'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  On Leave
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
