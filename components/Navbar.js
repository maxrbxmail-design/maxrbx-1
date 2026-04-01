'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  // ─── 1. USER STATE (The brain of the nav) ───────────────────────────────────
  // Eventually, replace these with your actual Auth system or localStorage checks!
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState('Player');
  const [robuxBalance, setRobuxBalance] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(''); // Put Roblox headshot URL here when fetched

  useEffect(() => {
    // 💡 This is where you would grab the verified user data you mentioned!
    // Example: const user = localStorage.getItem('roblox_user');
    // if (user) { setIsLoggedIn(true); setUsername(user.name); }
  }, []);

  // ─── 2. NAVIGATION LOCK ───────────────────────────────────────────────────
  const handleProtectedNavigation = (e, path) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // If not logged in, force them to the login flow on the dashboard
      router.push('/dashboard');
    } else {
      router.push(path);
    }
  };

  return (
    <nav className="border-b border-white/5 bg-[#0B0C10] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── LOGO (Left) ──────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 flex items-center justify-center transition-all duration-300">
            <img src="/max.png" alt="MaxRBX Logo" className="h-full w-auto object-contain" />
          </div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-white">
            MaxRBX
          </span>
        </Link>

        {/* ── LINKS & USER CARD (Right) ─────────────────────────────────────── */}
        <div className="flex items-center gap-8">
          
          {/* Home */}
          <Link
            href="/"
            className="text-white/60 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            Home
          </Link>

          {/* Earn (Protected) */}
          <button
            onClick={(e) => handleProtectedNavigation(e, '/dashboard')}
            className="text-white/60 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            Earn
          </button>

          {/* Withdraw (Protected) */}
          <button
            onClick={(e) => handleProtectedNavigation(e, '/withdraw')}
            className="text-white/60 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            Withdraw
          </button>

          {/* Discord (Replaced Leaderboard per your request!) */}
          <a
            href="https://discord.gg/your-invite"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            Discord
          </a>

          <div className="ml-2 h-6 w-px bg-white/10" /> {/* Subtle divider */}

          {/* ── DYNAMIC USER INTERFACE ──────────────────────────────────────── */}
          {isLoggedIn ? (
            /* Logged In State: Shows Roblox Character & Currency */
            <div className="flex items-center gap-3 bg-[#13151A] border border-white/10 p-1 pr-3.5 rounded-xl hover:border-white/20 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center border border-white/10">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white/40">{username.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col text-left leading-none gap-0.5">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{username}</span>
                <span className="text-sm font-bold text-[#39FF14]">R$ {robuxBalance}</span>
              </div>
            </div>
          ) : (
            /* Logged Out State: Big Green Start Earning Button */
            <button
              onClick={() => router.push('/dashboard')}
              className="text-xs font-bold px-5 py-2.5 hover:brightness-110 transition-all rounded-lg text-black uppercase tracking-wider"
              style={{ backgroundColor: '#39FF14' }}
            >
              Start Earning
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}
