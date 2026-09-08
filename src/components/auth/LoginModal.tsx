import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../services/authContext';
import { useToast } from '../ui/Toast';
import { Mail, Lock, Shield, KeyRound, Home, Wrench } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const { login, loginAsRole, allUsers } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Email required', 'Please enter your account email.');
      return;
    }
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      success('Welcome back!', 'Signed into CommunityHub successfully.');
      onClose();
    } else {
      error('Login failed', res.error || 'Invalid credentials');
    }
  };

  const handleRoleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    success('Logged in!', `Signed in as ${role.toLowerCase()}.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign in to CommunityHub"
      subtitle="Access your residential account"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Quick 1-Click Role Login Bar */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            1-Click Demo Login:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => handleRoleQuickLogin('ADMIN')}
              className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-rose-100/70 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickLogin('OWNER')}
              className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-purple-100/70 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-colors text-center"
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickLogin('TENANT')}
              className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-blue-100/70 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors text-center"
            >
              Tenant
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickLogin('WORKER')}
              className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-amber-100/70 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors text-center"
            >
              Worker
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-400">or sign in with credentials</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <Input
          label="Email Address"
          type="email"
          required
          placeholder="e.g. emily.tenant@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <div className="flex justify-between items-center text-xs">
          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
            <span>Remember session</span>
          </label>
          <button
            type="button"
            onClick={() => setEmail('emily.tenant@example.com')}
            className="text-blue-600 hover:underline font-medium"
          >
            Auto-fill demo tenant
          </button>
        </div>

        <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>

        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register new resident/flat
          </button>
        </p>
      </form>
    </Modal>
  );
};
