import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginModalProps {
  onLogin: (name: string) => void;
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }
    onLogin(name);
  };

  return (
    <div className="fixed inset-0 bg-dark/95 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-8 bg-dark border border-white/10 rounded-xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-xl">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to Chat</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
              Enter Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="John Doe"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-3 font-medium transition-colors"
          >
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
}