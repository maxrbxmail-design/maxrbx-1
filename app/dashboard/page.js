'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Offerwall config ─────────────────────────────────────────────────────────
// Each entry will render as a full iframe panel. Toggle `live` to show/hide.
// Replace `src` with real offerwall embed URLs from each provider's dashboard.

const OFFERWALLS = [
  {
    id:       'cpagraph',
    name:     'CPAGraph',
    icon:     '🎯',
    desc:     'Surveys, installs, and sign-ups',
    category: 'Surveys',
    src:      null, // e.g. 'https://cpagraph.com/widget?uid=USER_ID&pub=PUB_ID'
    color:    '#6366f1',
  },
  {
    id:       'lootably',
    name:     'Lootably',
    icon:     '🏆',
    desc:     'Games, videos, and daily polls',
    category: 'Games',
    src:      null, // e.g. 'https://wall.lootably.com/?placementID=YOUR_ID&uid=USER_ID'
    color:    '#f59e0b',
  },
  {
    id:       'mmwall',
    name:     'MMWall',
    icon:     '📱',
    desc:     'App installs and mobile offers',
    category: 'Apps',
    src:      null,
    color:    '#ec4899',
  },
  {
    id:       'ayet',
    name:     'Ayet Studios',
    icon:     '🎮',
    desc:     'Premium game trials and surveys',
    category: 'Games',
    src:      null,
    color:    '#14b8a6',
  },
  {
    id:       'theoremreach',
    name:     'TheoremReach',
    icon:     '📊',
    desc:     'High-paying survey router',
    category: 'Surveys',
    src:      null,
    color:    '#8b5cf6',
  },
  {
    id:       'adgatemedia',
    name:     'Adgate Media',
    icon:     '💡',
    desc:     'Videos, surveys, and app offers',
    category: 'Mixed',
    src:      null,
    color:    '#f97316',
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(OFFERWALLS.map((o) => o.category)))];

// ─── Offerwall card (placeholder) ─────────────────────────────────────────────

function OfferwallCard({ wall, onOpen }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group cursor-pointer"
      style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.08)' }}
      onClick={() => onOpen(wall)}
    >
      {/* Colour header stripe */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(to right, ${wall.color}, transparent)` }}
      />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border"
            style={{ backgroundColor: `${wall.color}15`, borderColor: `${wall.color}30` }}
          >
            {wall.icon}
          </div>
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
          >
            {wall.category}
          </span>
        </div>

        <h3 className="text-base font-extrabold text-white mb-1">{wall.name}</h3>
        <p className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{wall.desc}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Earn R$ instantly
          </span>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black transition-all duration-200 group-hover:brightness-110"
            style={{ backgroundColor: '#39FF14' }}
          >
            Start
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Offerwall modal (iframe embed) ──────────────────────────────────────────

function OfferwallModal({ wall, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-5xl h-[80vh] rounded-2xl border flex flex-col overflow-hidden"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(57,255,20,0.2)' }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{wall.icon}</span>
            <div>
              <p className="text-sm font-extrabold text-white">{wall.name}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{wall.desc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors text-xl leading-none px-2"
          >
            ✕
          </button>
        </div>

        {/* iframe or placeholder */}
        <div className="flex-1 overflow-hidden">
          {wall.src ? (
            <iframe
              src={wall.src}
              className="w-full h-full border-0"
              title={wall.name}
              allow="clipboard-write"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border"
                style={{ backgroundColor: `${wall.color}12`, borderColor: `${wall.color}25` }}
              >
                {wall.icon}
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-white">{wall.name} — Coming Soon</p>
                <p className="text-sm mt-1 max-w-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  This offerwall integration is being configured. Add your embed URL to{' '}
                  <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                    app/dashboard/page.js
                  </code>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [category, setCategory]   = useState('All');
  const [activeWall, setActiveWall] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then((r) => { if (r.status === 401) { router.push('/'); return null; } return r.json(); })
      .then((d) => { if (d?.user) setUser(d.user); })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = category === 'All'
    ? OFFERWALLS
    : OFFERWALLS.filter((w) => w.category === category);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#0B0C10' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#39FF14', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 sm:px-6 py-10" style={{ backgroundColor: '#0B0C10' }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#39FF14' }}>
            Welcome back, {user?.username} ·{' '}
            <span className="text-white">{user?.points ?? 0} R$</span>
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Earn Robux
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Pick an offerwall below. Complete tasks to build your R$ balance.
          </p>
        </div>

        {/* ── Stats strip ─────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-5 rounded-2xl border"
          style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          {[
            { label: 'Your Balance',      value: `${user?.points ?? 0} R$`, accent: true  },
            { label: 'Offers Available',  value: OFFERWALLS.length,          accent: false },
            { label: 'Avg. Payout',       value: '5m 30s',                   accent: false },
            { label: 'Your Lifetime',     value: `${user?.points ?? 0} R$`, accent: true  },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {s.label}
              </span>
              <span className="text-xl font-extrabold" style={{ color: s.accent ? '#39FF14' : '#fff' }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Category filter ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200"
              style={{
                backgroundColor: category === cat ? '#39FF14'                   : 'rgba(255,255,255,0.05)',
                color:           category === cat ? '#000'                       : 'rgba(255,255,255,0.5)',
                border:          category === cat ? '1px solid transparent'      : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Offerwall grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((wall) => (
            <OfferwallCard
              key={wall.id}
              wall={wall}
              onOpen={setActiveWall}
            />
          ))}
        </div>

        {/* ── Bottom notice ───────────────────────────────────────────────── */}
        <div
          className="mt-10 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ backgroundColor: '#13151A', borderColor: 'rgba(57,255,20,0.12)' }}
        >
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <p className="text-sm font-bold text-white">Need help or missing a payout?</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Payouts are processed automatically after offer verification. If yours is delayed, open a ticket in our Discord.
            </p>
          </div>
          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-black transition-all hover:brightness-110"
            style={{ backgroundColor: '#39FF14' }}
          >
            Join Discord
          </a>
        </div>

        <p className="text-center text-[10px] font-semibold tracking-[0.3em] uppercase mt-10" style={{ color: 'rgba(255,255,255,0.12)' }}>
          MaxRBX Platform v1.0 — All Systems Nominal
        </p>
      </div>

      {/* Offerwall modal */}
      {activeWall && (
        <OfferwallModal wall={activeWall} onClose={() => setActiveWall(null)} />
      )}
    </div>
  );
}
