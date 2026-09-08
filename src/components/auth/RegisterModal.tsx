import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { useToast } from '../ui/Toast';
import { UserRole } from '../../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const { register } = useAuth();
  const { success, error } = useToast();

  const flats = storage.getFlats();
  const vacantFlats = flats.filter((f) => f.occupancy_status === 'VACANT');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('TENANT');
  const [flatId, setFlatId] = useState(vacantFlats[0]?.id || flats[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      error('Missing fields', 'Please provide full name, email, and contact number.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      name,
      email,
      phone,
      role,
      flat_id: flatId || undefined,
    });
    setIsLoading(false);

    if (res.success) {
      success('Account Created!', `Welcome to CommunityHub, ${name}.`);
      onClose();
    } else {
      error('Registration failed', res.error || 'Unable to register account.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Resident Account"
      subtitle="Join Grand Palms Residency digital platform"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
        <Input
          label="Full Name"
          required
          placeholder="e.g. Rohan Verma"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          required
          placeholder="e.g. rohan@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Phone Number"
          type="tel"
          required
          placeholder="e.g. +91 98765 00000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Select
          label="Account Role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="TENANT">Tenant / Resident</option>
          <option value="OWNER">Property Owner</option>
        </Select>

        <Select
          label="Assign Apartment / Flat"
          value={flatId}
          onChange={(e) => setFlatId(e.target.value)}
          helperText="Select your designated unit within Grand Palms Residency"
        >
          {flats.map((f) => (
            <option key={f.id} value={f.id}>
              Flat {f.flat_number} ({f.flat_type} - {f.occupancy_status})
            </option>
          ))}
        </Select>

        <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={isLoading}>
          Create Account & Sign In
        </Button>

        <p className="text-center text-xs text-slate-500 pt-2">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign in here
          </button>
        </p>
      </form>
    </Modal>
  );
};
