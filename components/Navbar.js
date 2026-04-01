'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

// ─── Login Modal ──────────────────────────────────────────────────────────────

function LoginModal({ onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) { setError('Enter your Roblox username.'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed.'); return; }
      onSuccess();
    } catch { setError('Network error. Try again.'); }
    finally   { setLoading(false); }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 border relative"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(57,255,20,0.2)' }}
      >
        {/* Glow top */}
        <div
          className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
          style={{ background: 'linear-gradient(to right, transparent, rgba(57,255,20,0.5), transparent)' }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors text-lg leading-none"
        >
          ✕
        </button>

        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#39FF14' }}>
            MaxRBX
          </p>
          <h2 className="text-xl font-extrabold text-white">Sign In</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            No password needed — just your username.
          </p>
        </div>

        <div className="space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Roblox Username"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none border transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: '#1A1D27',
              borderColor: error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)',
            }}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-black transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: '#39FF14' }}
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </div>
        <p className="mt-4 text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          No credit card · No password · Instant setup
        </p>
      </div>
    </div>
  );
}

// ─── Nav links config ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Earn',     href: '/dashboard' },
  { label: 'Withdraw', href: '/withdraw'  },
  { label: 'Refer',    href: '/account'   },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [user, setUser]             = useState(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [hydrated, setHydrated]     = useState(false);
  const dropRef  = useRef(null);
  const router   = useRouter();
  const pathname = usePathname();

  // ── Fetch session on mount ──────────────────────────────────────────────
  const fetchMe = useCallback(async () => {
    try {
      const res  = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch { setUser(null); }
    finally   { setHydrated(true); }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  // ── Custom events ───────────────────────────────────────────────────────
  useEffect(() => {
    const openHandler   = () => setModalOpen(true);
    const logoutHandler = () => { setUser(null); setDropOpen(false); router.push('/'); };

    window.addEventListener('maxrbx:open-login',  openHandler);
    window.addEventListener('maxrbx:logged-out',  logoutHandler);
    return () => {
      window.removeEventListener('maxrbx:open-login',  openHandler);
      window.removeEventListener('maxrbx:logged-out',  logoutHandler);
    };
  }, [router]);

  // ── Close dropdown on outside click ────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    setDropOpen(false);
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    window.dispatchEvent(new CustomEvent('maxrbx:logged-out'));
    router.push('/');
  };

  // ── Login success ────────────────────────────────────────────────────────
  const handleLoginSuccess = async () => {
    setModalOpen(false);
    await fetchMe();
    router.push('/dashboard');
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'rgba(11,12,16,0.9)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(255,255,255,0.07)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-black transition-all duration-200 group-hover:brightness-110"
              style={{ backgroundColor: '#39FF14' }}
            >
              M
            </div>
            <span className="text-base font-extrabold tracking-tight text-white">
              Max<span style={{ color: '#39FF14' }}>RBX</span>
            </span>
          </Link>

          {/* Centre nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  color: isActive(link.href) ? '#39FF14' : 'rgba(255,255,255,0.55)',
                  backgroundColor: isActive(link.href) ? 'rgba(57,255,20,0.08)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — auth area */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!hydrated ? (
              /* Skeleton while loading */
              <div className="w-28 h-9 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            ) : user ? (
              /* ── Logged-in user profile pill + dropdown ── */
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen((v) => !v)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-200 hover:border-[#39FF14]/40"
                  style={{
                    backgroundColor: '#13151A',
                    borderColor: dropOpen ? 'rgba(57,255,20,0.4)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: 'rgba(57,255,20,0.4)' }}>
                    {user.avatarUrl ? (
                      <Image src={user.avatarUrl} alt={user.username} width={28} height={28} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: '#39FF14' }}>
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Username + balance */}
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-white leading-none">{user.username}</p>
                    <p className="text-[10px] mt-0.5 font-semibold" style={{ color: '#39FF14' }}>
                      {user.points ?? 0} R$
                    </p>
                  </div>
                  {/* Chevron */}
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{
                      color: 'rgba(255,255,255,0.35)',
                      transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border overflow-hidden shadow-2xl"
                    style={{
                      backgroundColor: '#0F1117',
                      borderColor: 'rgba(255,255,255,0.1)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(57,255,20,0.08)',
                    }}
                  >
                    {/* Top glow line */}
                    <div
                      className="h-px w-full"
                      style={{ background: 'linear-gradient(to right, transparent, rgba(57,255,20,0.4), transparent)' }}
                    />

                    <div className="p-1">
                      <Link
                        href="/account"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/5"
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-base" style={{ backgroundColor: 'rgba(57,255,20,0.1)' }}>
                          👤
                        </span>
                        Account
                      </Link>

                      <div className="h-px mx-2 my-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 hover:bg-red-500/10"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-base" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                          🚪
                        </span>
                        <span className="hover:text-red-400 transition-colors">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged-out state ── */
              <button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: '#39FF14' }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login modal */}
      {modalOpen && (
        <LoginModal
          onClose={() => setModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
