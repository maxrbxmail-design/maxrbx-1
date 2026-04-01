'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function Panel({ label, value, status, index }) {
  return (
    <div
      className="rounded-2xl p-8 border flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: '#13151A',
        borderColor: 'rgba(255,255,255,0.08)',
        animationDelay: `${index * 120}ms`,
      }}
    >
      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {label}
      </p>
      <p className="text-2xl font-extrabold tracking-tight" style={{ color: '#39FF14' }}>
        {value}
      </p>
      {status && (
        <p
          className="text-xs mt-2 pt-3 border-t"
          style={{ color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then((r) => {
        if (r.status === 401) { router.push('/'); return null; }
        return r.json();
      })
      .then((data) => { if (data?.user) setUser(data.user); })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [router]);

const handleLogout = async () => {
    // 1. Tell the server to delete the session cookie
    await fetch('/api/logout', { method: 'POST' });
    
    // 2. Tell the Navbar to clear its memory!
    window.dispatchEvent(new CustomEvent('maxrbx:logged-out'));
    
    // 3. Force a hard window redirect to the home page (This clears Next.js cache!)
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[calc(100vh-64px)]"
        style={{ backgroundColor: '#0B0C10' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#39FF14', borderTopColor: 'transparent' }}
          />
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100vh-64px)] px-6 py-14"
      style={{ backgroundColor: '#0B0C10' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        {/* Avatar is intentionally removed — the Navbar already shows it. */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#39FF14' }}>
              ◆ Active Session
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back,{' '}
              <span style={{ color: '#39FF14' }}>{user?.username ?? '...'}</span>
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Here's your earning overview.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex-shrink-0 text-xs font-semibold tracking-widest uppercase px-4 py-2.5 rounded-lg border transition-all duration-200 hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            Sign Out
          </button>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-10"
          style={{ background: 'linear-gradient(to right, transparent, rgba(57,255,20,0.3), transparent)' }}
        />

        {/* ── Stat panels ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <Panel
            index={0}
            label="Current Balance"
            value={`${user?.points ?? 0} R$`}
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

        {/* ── Activity placeholder ─────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Recent Activity
          </p>
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.15)' }}
            >
              📋
            </div>
            <p className="text-sm font-semibold text-white">No activity yet</p>
            <p className="text-xs text-center max-w-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Complete your first task to see your earning history appear here.
            </p>
          </div>
        </div>

        {/* Bottom status line */}
        <p
          className="text-center text-[10px] font-semibold tracking-[0.3em] uppercase mt-12"
          style={{ color: 'rgba(255,255,255,0.15)' }}
        >
          MaxRBX Platform v1.0 — All Systems Nominal
        </p>

      </div>
    </div>
  );
}
