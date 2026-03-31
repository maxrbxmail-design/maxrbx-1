'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

function Panel({ label, value, status, index }) {
  return (
    <div
      className="cyber-card p-6 relative"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <span className="corner-tl" />
      <span className="corner-tr" />
      <span className="corner-bl" />
      <span className="corner-br" />

      <p className="text-cyan-400/60 text-[10px] tracking-[0.35em] uppercase mb-3">
        {label}
      </p>
      <p className="chrome-text text-2xl font-bold tracking-tight mb-2">{value}</p>
      {status && (
        <p className="text-white/30 text-xs tracking-widest uppercase mt-4 border-t border-white/10 pt-3">
          {status}
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const u = Cookies.get('roblox_username');
    if (!u) {
      router.push('/');
    } else {
      setUsername(u);
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('roblox_username');
    router.push('/');
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-cyan-400 text-[10px] tracking-[0.4em] uppercase mb-1">
              ◆ Active Session
            </p>
            <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase">
              Logged in as:{' '}
              <span className="chrome-text">{username || '...'}</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-cyan-400 text-[10px] tracking-[0.3em] uppercase transition-colors duration-200 border border-white/10 hover:border-cyan-400/40 px-3 py-2"
          >
            ✕ Logout
          </button>
        </div>

        {/* Stat bar */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent mb-10" />

        {/* Panels grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Panel
            index={0}
            label="Current Balance"
            value="0 R$"
            status="No transactions yet"
          />
          <Panel
            index={1}
            label="Earning Hub"
            value="Surveys"
            status="Coming Soon"
          />
          <Panel
            index={2}
            label="Withdrawal Portal"
            value="Group Payouts"
            status="Coming Soon"
          />
        </div>

        {/* Bottom notice */}
        <p className="text-center text-white/15 text-[10px] tracking-[0.3em] uppercase mt-14">
          ROBROUX PLATFORM v1.0 — ALL SYSTEMS NOMINAL
        </p>
      </div>
    </div>
  );
}
