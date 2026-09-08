import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { useToast } from '../ui/Toast';
import { Wrench, CheckCircle, Clock, AlertCircle, Star, Phone } from 'lucide-react';
import { EnrichedComplaint, Worker, WorkerAvailability } from '../../types';

interface WorkerDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { success } = useToast();
  const [workerRecord, setWorkerRecord] = useState<Worker | null>(null);
  const [tasks, setTasks] = useState<EnrichedComplaint[]>([]);

  // Resolution Modal
  const [resolvingTask, setResolvingTask] = useState<EnrichedComplaint | null>(null);
  const [notes, setNotes] = useState('');

  const refresh = () => {
    if (!currentUser) return;
    const workers = storage.getWorkers();
    const w = workers.find((item) => item.user_id === currentUser.id);
    setWorkerRecord(w || null);

    if (w) {
      const allComplaints = storage.getEnrichedComplaints();
      setTasks(allComplaints.filter((c) => c.assigned_worker_id === w.id));
    }
  };

  useEffect(() => {
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [currentUser]);

  const activeTasks = tasks.filter(
    (t) => t.status === 'Assigned' || t.status === 'Acknowledged' || t.status === 'In Progress'
  );
  const completedTasks = tasks.filter((t) => t.status === 'Resolved' || t.status === 'Closed');

  const handleToggleStatus = () => {
    if (!workerRecord) return;
    const next: WorkerAvailability =
      workerRecord.availability === 'AVAILABLE'
        ? 'BUSY'
        : workerRecord.availability === 'BUSY'
        ? 'ON_LEAVE'
        : 'AVAILABLE';

    storage.updateWorkerAvailability(workerRecord.id, next);
    success('Availability Updated', `You are now marked as ${next}.`);
  };

  const handleAcknowledge = (task: EnrichedComplaint) => {
    storage.updateComplaintStatus(task.id, 'In Progress', currentUser!.id, 'Technician on-site and starting work.');
    success('Task Started', `Working on ticket: ${task.title}`);
  };

  const handleCompleteTask = () => {
    if (!resolvingTask) return;
    storage.updateComplaintStatus(
      resolvingTask.id,
      'Resolved',
      currentUser!.id,
      'Issue fixed and tested.',
      notes || 'Maintenance completed successfully.'
    );
    success('Job Completed', `Ticket ${resolvingTask.title} resolved.`);
    setResolvingTask(null);
    setNotes('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60 mb-1.5">
            <Wrench className="w-3.5 h-3.5" />
            <span>Community Technician Workstation</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Welcome, {currentUser?.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Trade: <strong>{workerRecord?.worker_type}</strong> • Current Duty Status:{' '}
            <span className="font-semibold text-slate-800">{workerRecord?.availability}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleStatus}>
            Toggle Availability
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigateTab('tasks')}>
            Assigned Queue ({activeTasks.length})
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable onClick={() => onNavigateTab('tasks')} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{activeTasks.length}</span>
            <div className="text-xs text-amber-600 font-medium mt-1">Pending resolution</div>
          </div>
        </Card>

        <Card hoverable onClick={() => onNavigateTab('history')} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">{completedTasks.length}</span>
            <div className="text-xs text-slate-500 mt-1">Total lifetime closures</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resident Rating</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{workerRecord?.rating || 4.9}</span>
            <div className="text-xs text-slate-500 mt-1">Based on feedback</div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duty Status</span>
            <StatusBadge status={workerRecord?.availability || 'AVAILABLE'} />
          </div>
          <div className="mt-3">
            <span className="text-sm font-bold text-slate-900 block capitalize">
              {workerRecord?.availability?.toLowerCase().replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400">Grand Palms On-Call</span>
          </div>
        </Card>
      </div>

      {/* Active Tasks Queue */}
      <Card>
        <CardHeader
          title="Priority Dispatch Queue"
          subtitle="Resident tickets assigned to your maintenance docket"
        />

        <div className="divide-y divide-slate-100">
          {activeTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No pending jobs on your docket right now. Great job!
            </div>
          ) : (
            activeTasks.map((t) => (
              <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={t.status} />
                    <StatusBadge status={t.priority} />
                    <span className="text-xs font-bold text-slate-900">
                      Flat {t.flat_number} ({t.building_name})
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {t.status !== 'In Progress' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledge(t)}
                    >
                      Start Job
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() => setResolvingTask(t)}
                    >
                      Mark Done
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Completion Modal */}
      <Modal
        isOpen={!!resolvingTask}
        onClose={() => setResolvingTask(null)}
        title="Complete Maintenance Task"
        subtitle={resolvingTask?.title}
        maxWidth="md"
      >
        <div className="space-y-4 text-left">
          <Input
            label="Resolution Notes & Actions Taken"
            required
            placeholder="e.g. Replaced leaking valve, tested pressure for 15 mins, no drips observed."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setResolvingTask(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCompleteTask}>
              Submit & Close Ticket
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
