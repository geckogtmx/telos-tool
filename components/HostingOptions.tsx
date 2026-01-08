'use client';

import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

type HostingType = 'open' | 'encrypted' | 'private';

type HostingOptionsProps = {
  onSave: (hostingType: HostingType, password?: string) => Promise<void>;
  isSaving: boolean;
  initialHostingType?: HostingType;
};

export default function HostingOptions({ onSave, isSaving, initialHostingType }: HostingOptionsProps) {
  const [hostingType, setHostingType] = useState<HostingType | null>(initialHostingType || null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!hostingType) return;

    if (hostingType === 'encrypted') {
      if (password.length < 12) {
        setError('Password must be at least 12 characters');
        return;
      }
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      if (!hasUppercase || !hasLowercase || !hasNumber) {
        setError('Password must contain uppercase, lowercase, and a number');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setError('');
    onSave(hostingType, password);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-gray-100 mb-4">Save & Host</h3>
      <p className="text-gray-400 mb-6">
        Choose how you want to save your TELOS file. You can keep it private, share it openly, or protect it with a password.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => { setHostingType('open'); setError(''); }}
          className={`p-4 rounded-lg border text-left transition-colors ${
            hostingType === 'open'
              ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500'
              : 'bg-gray-800 border-gray-700 hover:border-gray-500'
          }`}
        >
          <div className="font-semibold text-gray-100 mb-1">Open Hosting</div>
          <div className="text-sm text-gray-400">Public link accessible by anyone with the URL</div>
        </button>

        <button
          onClick={() => { setHostingType('encrypted'); setError(''); }}
          className={`p-4 rounded-lg border text-left transition-colors ${
            hostingType === 'encrypted'
              ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500'
              : 'bg-gray-800 border-gray-700 hover:border-gray-500'
          }`}
        >
          <div className="font-semibold text-gray-100 mb-1">Encrypted</div>
          <div className="text-sm text-gray-400">Password protected link</div>
        </button>

        <button
          onClick={() => { setHostingType('private'); setError(''); }}
          className={`p-4 rounded-lg border text-left transition-colors ${
            hostingType === 'private'
              ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500'
              : 'bg-gray-800 border-gray-700 hover:border-gray-500'
          }`}
        >
          <div className="font-semibold text-gray-100 mb-1">Private</div>
          <div className="text-sm text-gray-400">Only visible to you in your dashboard</div>
        </button>
      </div>

      {hostingType === 'encrypted' && (
        <div className="mb-6 max-w-md space-y-4">
          <div className="relative">
             <Input
                label="Set Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 12 chars, upper, lower, number"
                error={error && !error.includes('match') ? error : undefined}
             />
             <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-200"
             >
               {showPassword ? (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
               ) : (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
               )}
             </button>
          </div>
          <Input
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password..."
            error={error && error.includes('match') ? error : undefined}
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hostingType || isSaving}
          className={!hostingType ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {isSaving ? 'Saving...' : 'Save TELOS'}
        </Button>
      </div>
    </Card>
  );
}
