import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { StatusBadge } from '../ui/Badge';
import { storage } from '../../services/storage';
import { useToast } from '../ui/Toast';
import { Worker, WorkerCategory, WorkerAvailability, User } from '../../types';
import { Wrench, Plus, Star, CheckCircle, Phone, Mail, UserCheck } from 'lucide-react';

export const WorkersManagement: React.FC = () => {
  const { success, error } = useToast();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Add Worker Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [workerType, setWorkerType] = useState<WorkerCategory>('Plumber');
  const [availability, setAvailability] = useState<WorkerAvailability>('AVAILABLE');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(4.8);

  const refresh = () => {
    setWorkers(storage.getWorkers());
    setUsers(storage.getUsers());
  };

  useEffect(() => {
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      error('Missing details', 'Name, email, and phone number are required.');
      return;
    }

    storage.createWorker(
      {
        name,
        email,
        phone,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        is_active: true,
      },
      {
        worker_type: workerType,
        phone,
        availability,
        description,
        is_active: true,
        rating: Number(rating),
      }
    );

    success('Worker Added', `${name} (${workerType}) joined the maintenance staff.`);
    setIsAddOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setDescription('');
  };

  const handleToggleAvailability = (worker: Worker) => {
    const nextAvailability: WorkerAvailability =
      worker.availability === 'AVAILABLE' ? 'BUSY' : worker.availability === 'BUSY' ? 'ON_LEAVE' : 'AVAILABLE';

    storage.updateWorkerAvailability(worker.id, nextAvailability);
    success('Availability Updated', `Status set to ${nextAvailability}.`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Community Workers & Maintenance Crew</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage electricians, plumbers, housekeepers, and security staff assigned to the society.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddOpen(true)}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Workers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((w) => {
          const user = users.find((u) => u.id === w.user_id);
          return (
            <Card key={w.id} className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                      alt={user?.name}
                      className="w-11 h-11 rounded-full border border-slate-200 object-cover bg-slate-100"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{user?.name}</h3>
                      <span className="text-xs font-semibold text-blue-600">{w.worker_type}</span>
                    </div>
                  </div>
                  <StatusBadge status={w.availability} />
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {w.description || 'Dedicated on-site society maintenance specialist.'}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{w.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{w.rating}</span>
                  <span className="text-slate-400">({w.completed_tasks_count || 0} jobs)</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleAvailability(w)}
                >
                  Change Status
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Worker Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Community Worker"
        subtitle="Onboard a technician or maintenance staff to Grand Palms"
        maxWidth="md"
      >
        <form onSubmit={handleCreateWorker} className="space-y-3.5 text-left">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Suresh Gowda"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="e.g. suresh.maintenance@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Contact Phone"
            type="tel"
            required
            placeholder="e.g. +91 98450 00000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Service Profession"
              value={workerType}
              onChange={(e) => setWorkerType(e.target.value as WorkerCategory)}
            >
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Security">Security Guard</option>
              <option value="Maintenance">Maintenance General</option>
              <option value="Maid">Housekeeping / Maid</option>
              <option value="Chef">Chef / Cook</option>
              <option value="Laundry">Laundry Service</option>
              <option value="Water service">Water Utility</option>
              <option value="Other">Other Specialist</option>
            </Select>

            <Select
              label="Initial Availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value as WorkerAvailability)}
            >
              <option value="AVAILABLE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="ON_LEAVE">On Leave</option>
            </Select>
          </div>

          <Input
            label="Experience & Description"
            placeholder="e.g. Certified wiring and MCB specialist with 8 years experience"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Register Worker
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
