'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleAccess = async () => {
    if (!username.trim()) { setError('Username required.'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed. Try again.'); return; }
      router.push('/dashboard');
    } catch { setError('Network error. Please try again.'); }
    finally   { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleAccess(); };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center mb-14">
        <p className="text-xs tracking-[0.4em] uppercase mb-4 animate-pulse">
          ◆ SYSTEM ONLINE ◆
        </p>
        <h1 className="hero-text text-5xl md:text-7xl font-bold leading-tight tracking-tight uppercase">
          FUEL YOUR<br />
          <span className="chrome-text">ROBROUX</span><br />
          JOURNEY
        </h1>
        <p className="mt-6 text-sm tracking-widest uppercase">
          Earn · Withdraw · Dominate
        </p>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="cyber-card p-8">
          <span className="corner-tl" /><span className="corner-tr" />
          <span className="corner-bl" /><span className="corner-br" />
          <h2 className="text-xs tracking-[0.3em] uppercase mb-6">
            ▶ Initialize Access
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              onKeyDown={handleKey}
              placeholder="Enter Roblox Username"
              disabled={loading}
              className="cyber-input w-full px-4 py-3 bg-transparent text-white placeholder-white/30 text-sm tracking-widest outline-none disabled:opacity-50"
            />
            {error && <p className="text-red-400 text-xs tracking-widest">{error}</p>}
            <button
              onClick={handleAccess}
              disabled={loading}
              className="cyber-btn w-full py-3 text-sm tracking-[0.3em] uppercase font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </div>
        </div>
      </div>

      <p className="relative z-10 mt-10 text-white/20 text-[10px] tracking-[0.3em] uppercase">
        Secured Connection Established
      </p>
    </div>
  );
}
