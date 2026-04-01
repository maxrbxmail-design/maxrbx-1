'use client'; // This allows us to handle clicks and state!

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ─── Static data ────────────────────────────────────────────────────────────

const stats = [
  { label: 'Avg. Payout Time',    value: '5m 30s',         green: false },
  { label: 'Total Robux Earned',  value: 'R$ 12,450,000',  green: true  },
  { label: 'Active Users',        value: '2,401',           green: false },
];

const steps = [
  {
    number: '1',
    title: 'Link Account',
    desc:  'Connect your Roblox username — no password ever required. Setup takes under 30 seconds.',
  },
  {
    number: '2',
    title: 'Do Tasks',
    desc:  'Play games, complete surveys, enter giveaways, and more to rack up your Robux balance.',
  },
  {
    number: '3',
    title: 'Cash Out',
    desc:  'Withdraw directly to your Roblox account via group payout. Average delivery in 5m 30s.',
  },
];

const reviews = [
  {
    name:   'Zephyr_RBX',
    avatar: 'Z',
    rating: 5,
    text:   'Got my first payout in under 10 minutes. Legitimately the fastest earning site I have used.',
  },
  {
    name:   'bloxfan2012',
    avatar: 'B',
    rating: 5,
    text:   'Super easy surveys and the cashout was instant. No sketchy password stuff either, love it.',
  },
  {
    name:   'NovaSky_99',
    avatar: 'N',
    rating: 5,
    text:   'Been using MaxRBX for a month. Already earned over 2,000 Robux. Totally free and legit.',
  },
  {
    name:   'PixelDrifter',
    avatar: 'P',
    rating: 4,
    text:   'Clean site, fast payouts, and the giveaways are actually real. Highly recommend.',
  },
];

export default function HomePage() {
  // We'll use these to manage the login pop-up and user state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');

  const handleLoginClick = () => {
    if (isLoggedIn) {
      // If already logged in, take them to the dashboard
      window.location.href = '/dashboard';
    } else {
      // Otherwise, open the login pop-up
      setShowLoginModal(true);
    }
  };

  const submitLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== '') {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      // Here is where we will eventually save the user to the database!
    }
  };

  return (
    <div className="min-h-screen text-white relative" style={{ backgroundColor: '#0B0C10' }}>
      
      {/* ── CLEAN NAVIGATION BAR ─────────────────────────────────────────── */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-white/5 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="MaxRBX Logo" width={35} height={35} className="object-contain" />
          <span className="font-bold text-xl tracking-tight">MaxRBX</span>
        </Link>
        
        {/* Top Right Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Leaderboard
          </Link>

          {isLoggedIn ? (
            /* NEW: Logged In State (Avatar & Robux) */
            <div className="flex items-center gap-4 bg-[#13151A] border border-white/10 p-1.5 pr-4 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex items-center justify-center border border-white/20">
                {/* Fallback until we fetch the actual Roblox headshot */}
                <span className="text-xs font-bold text-white/50">{username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white/50">{username}</span>
                <span className="text-sm font-bold text-[#39FF14]">R$ 0</span>
              </div>
            </div>
          ) : (
            /* Logged Out State */
            <button
              onClick={handleLoginClick}
              className="text-sm font-bold px-4 py-2 hover:brightness-110 transition-colors rounded-lg text-black"
              style={{ backgroundColor: '#39FF14' }}
            >
              Start Earning
            </button>
          )}
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — copy */}
        <div>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#39FF14]/30 bg-[#39FF14]/5">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span className="text-[#39FF14] text-xs font-semibold tracking-widest uppercase">
              Trusted by 2,400+ users
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            Earn <span style={{ color: '#39FF14' }}>FREE Robux</span> by doing Simple Tasks
          </h1>

          <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Play games, do surveys, win giveaways, and more to get free robux. No password required.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleLoginClick}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-black transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ backgroundColor: '#39FF14' }}
            >
              Start Earning
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <button className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white border border-white/25 hover:border-white/50 hover:bg-white/5 transition-all duration-200 active:scale-95">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Tutorial
            </button>
          </div>

          <p className="mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            No credit card · No password · Instant setup
          </p>
        </div>

        {/* Right — image */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative" style={{ width: 400, height: 400 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 55%, rgba(57,255,20,0.18) 0%, rgba(57,255,20,0.05) 45%, transparent 70%)', transform: 'scale(1.15)' }} />
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(57,255,20,0.06) 70%, transparent 100%)' }} />

            <div className="relative w-full h-full">
              <Image src="/hero-render.png" alt="Roblox character" fill sizes="400px" className="object-contain drop-shadow-2xl" priority />
            </div>

            <div className="absolute -top-3 -right-4 flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-white/10 text-sm font-semibold" style={{ backgroundColor: '#13151A', backdropFilter: 'blur(12px)' }}>
              <span style={{ color: '#39FF14' }}>+R$ 450</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>just now</span>
            </div>

            <div className="absolute -bottom-3 -left-4 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-white/10 text-sm" style={{ backgroundColor: '#13151A', backdropFilter: 'blur(12px)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: '#39FF14' }}>✓</div>
              <div>
                <p className="font-semibold text-white text-xs">Payout confirmed</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>5m 12s delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ─────────────────────────────────────────────────────── */}
      <section className="border-y" style={{ borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style={{ divideColor: 'rgba(255,255,255,0.07)' }}>
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center py-6 sm:py-0 gap-1 text-center">
              <span className="text-3xl font-extrabold tracking-tight" style={{ color: s.green ? '#39FF14' : '#FFFFFF' }}>{s.value}</span>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#39FF14' }}>Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How it Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.08)' }}>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-[3.25rem] -right-3 w-6 h-px" style={{ backgroundColor: 'rgba(57,255,20,0.3)' }} />
              )}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold text-black mb-5" style={{ backgroundColor: '#39FF14' }}>{step.number}</div>
              <h3 className="text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POP-UP LOGIN MODAL ────────────────────────────────────────── */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#13151A] border border-white/10 p-8 rounded-2xl w-full max-w-md relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-2 text-center">Link Your Account</h3>
            <p className="text-white/50 text-sm text-center mb-6">Enter your Roblox username to continue. We will never ask for your password.</p>
            
            <form onSubmit={submitLogin} className="flex flex-col gap-4">
              <input 
                type="text"
                placeholder="Roblox Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                required
              />
              <button 
                type="submit"
                className="font-bold py-3 rounded-xl hover:brightness-110 transition-colors text-black"
                style={{ backgroundColor: '#39FF14' }}
              >
                Proceed to Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
