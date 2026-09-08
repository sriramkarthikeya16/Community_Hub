import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { storage } from '../../services/storage';
import { useToast } from '../ui/Toast';
import { User, EnrichedFlat } from '../../types';
import { KeyRound, Plus, Phone, Mail, Building, Search } from 'lucide-react';

export const OwnersManagement: React.FC = () => {
  const { success, error } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [flats, setFlats] = useState<EnrichedFlat[]>([]);
  const [search, setSearch] = useState('');

  // Add Owner Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [assignFlatId, setAssignFlatId] = useState('');

  const refresh = () => {
    setUsers(storage.getUsers());
    setFlats(storage.getEnrichedFlats());
  };

  useEffect(() => {
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  const owners = users.filter((u) => u.role === 'OWNER');
  const filteredOwners = owners.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search)
  );

  const handleCreateOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      error('Missing details', 'Name, email, and phone number are required.');
      return;
    }

    const newUser = storage.createUser({
      name,
      email,
      phone,
      role: 'OWNER',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      is_active: true,
    });

    if (assignFlatId) {
      storage.assignOwner(assignFlatId, newUser.id);
    }

    success('Owner Added', `${name} registered as property owner.`);
    setIsAddOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setAssignFlatId('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Apartment Owners Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered title holders, landlords, and society shareholders.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddOpen(true)}
        >
          Add Owner
        </Button>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <Input
          placeholder="Search by owner name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </Card>

      {/* Owners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOwners.map((owner) => {
          const ownedFlats = flats.filter((f) => f.owner_id === owner.id);
          return (
            <Card key={owner.id} className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={owner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner.name}`}
                    alt={owner.name}
                    className="w-11 h-11 rounded-full border border-slate-200 object-cover bg-slate-100"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{owner.name}</h3>
                    <span className="text-xs text-purple-600 font-semibold">Verified Owner</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{owner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{owner.email}</span>
                  </div>
                </div>

                {/* Owned Flats */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Owned Units ({ownedFlats.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ownedFlats.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No flats mapped</span>
                    ) : (
                      ownedFlats.map((f) => (
                        <span
                          key={f.id}
                          className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold"
                        >
                          Flat {f.flat_number} ({f.occupancy_status})
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Owner Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Property Owner"
        subtitle="Register new homeowner in Grand Palms Residency"
        maxWidth="md"
      >
        <form onSubmit={handleCreateOwner} className="space-y-3.5 text-left">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Vikram Singhania"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="e.g. vikram@singhania.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Phone Number"
            type="tel"
            required
            placeholder="e.g. +91 98200 11223"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Select
            label="Assign Flat Unit (Optional)"
            value={assignFlatId}
            onChange={(e) => setAssignFlatId(e.target.value)}
          >
            <option value="">-- Assign Later --</option>
            {flats.map((f) => (
              <option key={f.id} value={f.id}>
                Flat {f.flat_number} ({f.building_name})
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Register Owner
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
