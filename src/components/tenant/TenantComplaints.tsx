import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { StatusBadge } from '../ui/Badge';
import { storage } from '../../services/storage';
import { useAuth } from '../../services/authContext';
import { useToast } from '../ui/Toast';
import { EnrichedComplaint, ComplaintCategory, Priority } from '../../types';
import { AlertCircle, Plus, Wrench, CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface TenantComplaintsProps {
  initialOpenCreate?: boolean;
}

export const TenantComplaints: React.FC<TenantComplaintsProps> = ({
  initialOpenCreate = false,
}) => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();
  const [complaints, setComplaints] = useState<EnrichedComplaint[]>([]);
  const [myFlatId, setMyFlatId] = useState('');

  // Create Complaint Modal
  const [isOpenCreate, setIsOpenCreate] = useState(initialOpenCreate);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Plumbing');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [description, setDescription] = useState('');

  const refresh = () => {
    if (!currentUser) return;
    const flats = storage.getEnrichedFlats();
    const flat = flats.find((f) => f.tenant_id === currentUser.id || f.tenant?.id === currentUser.id);

    if (flat) {
      setMyFlatId(flat.id);
      const allComplaints = storage.getEnrichedComplaints();
      setComplaints(allComplaints.filter((c) => c.flat_id === flat.id));
    }
  };

  useEffect(() => {
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [currentUser]);

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      error('Missing fields', 'Title and description are required.');
      return;
    }

    if (!myFlatId) {
      error('No flat linked', 'Your account is not currently linked to an active flat.');
      return;
    }

    storage.createComplaint({
      flat_id: myFlatId,
      user_id: currentUser!.id,
      title,
      description,
      category,
      priority,
    });

    success('Ticket Submitted', 'Your maintenance request has been forwarded to society management.');
    setIsOpenCreate(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Maintenance & Service Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log electrical, plumbing, water, or housekeeping issues for rapid staff dispatch.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsOpenCreate(true)}
        >
          Raise New Ticket
        </Button>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {complaints.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
            No complaints raised. Click "Raise New Ticket" if you need maintenance assistance.
          </div>
        ) : (
          complaints.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <StatusBadge status={c.status} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {c.category}
                    </span>
                    <StatusBadge status={c.priority} />
                    <span className="text-[11px] text-slate-400">
                      Logged on {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.description}</p>

                  {c.resolution_notes && (
                    <div className="mt-2.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                      <span className="font-bold">Resolution Note:</span> {c.resolution_notes}
                    </div>
                  )}
                </div>

                {/* Worker Assignment Info */}
                <div className="shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 text-left md:text-right">
                  {c.worker_name ? (
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Assigned: {c.worker_name}
                      </span>
                      <span className="text-[11px] text-blue-600 font-medium">
                        {c.worker_type} • {c.worker_phone}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Awaiting staff assignment</span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal: Raise Complaint */}
      <Modal
        isOpen={isOpenCreate}
        onClose={() => setIsOpenCreate(false)}
        title="Raise Maintenance Request"
        subtitle="Our facility crew will be dispatched promptly"
        maxWidth="md"
      >
        <form onSubmit={handleCreateComplaint} className="space-y-3.5 text-left">
          <Input
            label="Ticket Subject"
            required
            placeholder="e.g. Master Bedroom Geyser not heating"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Issue Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Cleaning">Cleaning & Waste</option>
              <option value="Water">Water Pressure / Quality</option>
              <option value="Lift">Elevator / Lift</option>
              <option value="Security">Security Concern</option>
              <option value="Noise">Noise Disturbance</option>
              <option value="Other">Other Request</option>
            </Select>

            <Select
              label="Urgency Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="LOW">Low - Routine</option>
              <option value="MEDIUM">Medium - Normal</option>
              <option value="HIGH">High - Urgent</option>
              <option value="EMERGENCY">Emergency (Leak/Spark)</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description & Location
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the issue, when it started, and any specific access instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsOpenCreate(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
