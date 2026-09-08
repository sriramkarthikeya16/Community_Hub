import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { StatusBadge } from '../ui/Badge';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { useToast } from '../ui/Toast';
import { EnrichedComplaint } from '../../types';
import { Wrench, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

export const WorkerTasks: React.FC = () => {
  const { currentUser } = useAuth();
  const { success } = useToast();
  const [tasks, setTasks] = useState<EnrichedComplaint[]>([]);

  // Resolution Modal
  const [resolvingTask, setResolvingTask] = useState<EnrichedComplaint | null>(null);
  const [notes, setNotes] = useState('');

  const refresh = () => {
    if (!currentUser) return;
    const workers = storage.getWorkers();
    const w = workers.find((item) => item.user_id === currentUser.id);

    if (w) {
      const allComplaints = storage.getEnrichedComplaints();
      setTasks(
        allComplaints.filter(
          (c) =>
            c.assigned_worker_id === w.id &&
            c.status !== 'Resolved' &&
            c.status !== 'Closed' &&
            c.status !== 'Rejected'
        )
      );
    }
  };

  useEffect(() => {
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [currentUser]);

  const handleStartWork = (task: EnrichedComplaint) => {
    storage.updateComplaintStatus(task.id, 'In Progress', currentUser!.id, 'Technician actively repairing.');
    success('Status Updated', 'Ticket moved to In Progress.');
  };

  const handleCompleteTask = () => {
    if (!resolvingTask) return;
    storage.updateComplaintStatus(
      resolvingTask.id,
      'Resolved',
      currentUser!.id,
      'Work inspected and concluded.',
      notes || 'Repairs performed to standard.'
    );
    success('Task Resolved', `Marked ${resolvingTask.title} as completed.`);
    setResolvingTask(null);
    setNotes('');
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Active Work Orders</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tickets assigned to you for inspection, repair, or maintenance action.
        </p>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
            No pending tickets assigned. All maintenance requests are cleared!
          </div>
        ) : (
          tasks.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <StatusBadge status={t.status} />
                    <StatusBadge status={t.priority} />
                    <span className="text-xs font-bold text-slate-900">
                      Flat {t.flat_number} ({t.building_name})
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">Contact: {t.creator_name}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  {t.status !== 'In Progress' ? (
                    <Button variant="outline" size="sm" onClick={() => handleStartWork(t)}>
                      Start Work
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() => setResolvingTask(t)}
                    >
                      Resolve & Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

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
            label="Resolution Notes & Work Details"
            required
            placeholder="e.g. Replaced MCB switch and checked phase voltage. System stable."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setResolvingTask(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCompleteTask}>
              Submit & Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
