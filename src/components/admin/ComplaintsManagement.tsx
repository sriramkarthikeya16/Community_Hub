import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select, Input } from '../ui/Input';
import { StatusBadge } from '../ui/Badge';
import { storage } from '../../services/storage';
import { useToast } from '../ui/Toast';
import { EnrichedComplaint, Worker, User, ComplaintStatus } from '../../types';
import {
  AlertCircle,
  Wrench,
  Search,
  UserCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  History,
} from 'lucide-react';

export const ComplaintsManagement: React.FC = () => {
  const { success } = useToast();
  const [complaints, setComplaints] = useState<EnrichedComplaint[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Assign Worker Modal
  const [assignTarget, setAssignTarget] = useState<EnrichedComplaint | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  // Status/Resolution Modal
  const [statusTarget, setStatusTarget] = useState<EnrichedComplaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [adminComment, setAdminComment] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // History/Timeline Modal
  const [timelineTarget, setTimelineTarget] = useState<EnrichedComplaint | null>(null);

  const refresh = () => {
    setComplaints(storage.getEnrichedComplaints());
    setWorkers(storage.getWorkers());
    setUsers(storage.getUsers());
  };

  useEffect(() => {
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      (c.flat_number && c.flat_number.toLowerCase().includes(search.toLowerCase())) ||
      (c.creator_name && c.creator_name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleAssignWorker = () => {
    if (!assignTarget || !selectedWorkerId) return;

    storage.assignWorker(assignTarget.id, selectedWorkerId);
    const worker = workers.find((w) => w.id === selectedWorkerId);
    const workerUser = worker ? users.find((u) => u.id === worker.user_id) : null;

    success('Worker Assigned', `${workerUser?.name} (${worker?.worker_type}) assigned to ticket.`);
    setAssignTarget(null);
  };

  const handleUpdateStatus = () => {
    if (!statusTarget) return;

    storage.updateComplaintStatus(
      statusTarget.id,
      newStatus,
      'usr-admin-1',
      adminComment || undefined,
      resolutionNotes || undefined
    );

    success('Status Updated', `Ticket marked as ${newStatus}.`);
    setStatusTarget(null);
    setAdminComment('');
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Complaints & Maintenance Dispatch</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Triage residential issues, assign qualified maintenance workers, and monitor resolution timelines.
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search tickets, units, descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted (Unassigned)</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </Select>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="ALL">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Cleaning">Cleaning & Waste</option>
            <option value="Lift">Elevator / Lift</option>
            <option value="Water">Water Infrastructure</option>
            <option value="Security">Security & Access</option>
          </Select>
        </div>
      </Card>

      {/* Complaints Grid / Table */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
            No complaints found matching the filters.
          </div>
        ) : (
          filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <StatusBadge status={c.status} />
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                    {c.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    Flat {c.flat_number} ({c.building_name})
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">By {c.creator_name}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                  {c.description}
                </p>

                {c.resolution_notes && (
                  <div className="mt-2 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                    <strong>Resolution Note:</strong> {c.resolution_notes}
                  </div>
                )}
              </div>

              {/* Worker & Action Bar */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                <div className="text-left md:text-right">
                  {c.worker_name ? (
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        {c.worker_name}
                      </span>
                      <span className="text-[10px] text-blue-600 font-medium">
                        {c.worker_type} • {c.worker_phone}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Unassigned
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setAssignTarget(c);
                      setSelectedWorkerId(workers[0]?.id || '');
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    {c.assigned_worker_id ? 'Reassign' : 'Assign Worker'}
                  </button>

                  <button
                    onClick={() => {
                      setStatusTarget(c);
                      setNewStatus(c.status);
                      setResolutionNotes(c.resolution_notes || '');
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                  >
                    Status
                  </button>

                  <button
                    onClick={() => setTimelineTarget(c)}
                    title="View Timeline History"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Assign Worker */}
      <Modal
        isOpen={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title="Dispatch Maintenance Worker"
        subtitle={`Assign ticket: ${assignTarget?.title}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-left">
          <Select
            label="Select Service Professional"
            value={selectedWorkerId}
            onChange={(e) => setSelectedWorkerId(e.target.value)}
          >
            {workers.map((w) => {
              const u = users.find((usr) => usr.id === w.user_id);
              const isTradeMatch = w.worker_type.toLowerCase() === assignTarget?.category.toLowerCase();
              return (
                <option key={w.id} value={w.id}>
                  {u?.name} — {w.worker_type} ({w.availability}) {isTradeMatch ? '⭐ Recommended' : ''}
                </option>
              );
            })}
          </Select>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setAssignTarget(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAssignWorker}>
              Confirm Dispatch
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Update Status */}
      <Modal
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        title="Update Ticket Status"
        subtitle={statusTarget?.title}
        maxWidth="md"
      >
        <div className="space-y-3.5 text-left">
          <Select
            label="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
          >
            <option value="Submitted">Submitted</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </Select>

          <Input
            label="Audit Comment"
            placeholder="e.g. Technician dispatched with replacement part"
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
          />

          {(newStatus === 'Resolved' || newStatus === 'Closed') && (
            <Input
              label="Final Resolution Notes"
              placeholder="e.g. Leak repaired and water seal tested"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setStatusTarget(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleUpdateStatus}>
              Save Status
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Timeline History */}
      <Modal
        isOpen={!!timelineTarget}
        onClose={() => setTimelineTarget(null)}
        title="Complaint Timeline & Audit Trail"
        subtitle={timelineTarget?.title}
        maxWidth="md"
      >
        <div className="space-y-4 text-left py-1">
          {timelineTarget?.updates && timelineTarget.updates.length > 0 ? (
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
              {timelineTarget.updates.map((u) => {
                const user = users.find((usr) => usr.id === u.updated_by);
                return (
                  <div key={u.id} className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="flex items-center gap-2">
                      <StatusBadge status={u.new_status} />
                      <span className="text-[10px] text-slate-400">
                        {new Date(u.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">{u.comment}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      By: {user ? `${user.name} (${user.role})` : 'System'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No status updates recorded yet.</p>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setTimelineTarget(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
