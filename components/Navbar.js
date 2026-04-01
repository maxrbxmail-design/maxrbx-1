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

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);

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
        <div
          className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
          style={{ background: 'linear-gradient(to right, transparent, rgba(57,255,20,0.5), transparent)' }}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors text-lg leading-none"
        >✕</button>

        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#39FF14' }}>MaxRBX</p>
          <h2 className="text-xl font-extrabold text-white">Sign In</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>No password needed — just your username.</p>
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
            style={{ backgroundColor: '#1A1D27', borderColor: error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)' }}
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

// ─── Hamburger icon ───────────────────────────────────────────────────────────

function HamburgerIcon({ open }) {
  return (
    <div className="flex flex-col justify-center items-center w-5 h-5 gap-[5px]">
      <span
        className="block h-[2px] rounded-full transition-all duration-300 origin-center"
        style={{
          width: '20px',
          backgroundColor: '#fff',
          transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
        }}
      />
      <span
        className="block h-[2px] rounded-full transition-all duration-200"
        style={{
          width: '20px',
          backgroundColor: '#fff',
          opacity: open ? 0 : 1,
          transform: open ? 'scaleX(0)' : 'scaleX(1)',
        }}
      />
      <span
        className="block h-[2px] rounded-full transition-all duration-300 origin-center"
        style={{
          width: '20px',
          backgroundColor: '#fff',
          transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
        }}
      />
    </div>
  );
}

// ─── Nav links config ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Earn',     href: '/dashboard', icon: '💰' },
  { label: 'Withdraw', href: '/withdraw',  icon: '💸' },
  { label: 'Refer',    href: '/account',   icon: '🔗' },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [user, setUser]           = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated]   = useState(false);

  const dropRef   = useRef(null);
  const router    = useRouter();
  const pathname  = usePathname();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Fetch session
  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) { const d = await res.json(); setUser(d.user ?? null); }
      else setUser(null);
    } catch { setUser(null); }
    finally { setHydrated(true); }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  // Custom events
  useEffect(() => {
    const openHandler   = () => setModalOpen(true);
    const logoutHandler = () => { setUser(null); setDropOpen(false); setMobileOpen(false); router.push('/'); };
    window.addEventListener('maxrbx:open-login', openHandler);
    window.addEventListener('maxrbx:logged-out', logoutHandler);
    return () => {
      window.removeEventListener('maxrbx:open-login', openHandler);
      window.removeEventListener('maxrbx:logged-out', logoutHandler);
    };
  }, [router]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setDropOpen(false); setMobileOpen(false);
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    window.dispatchEvent(new CustomEvent('maxrbx:logged-out'));
    router.push('/');
  };

  const handleLoginSuccess = async () => {
    setModalOpen(false); setMobileOpen(false);
    await fetchMe();
    router.push('/dashboard');
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* ── Slide-in animation keyframes (injected once) ── */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .mobile-menu-enter { animation: slideDown 0.22s ease forwards; }
      `}</style>

      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'rgba(11,12,16,0.95)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(255,255,255,0.07)',
        }}
      >
        {/* ── Desktop / mobile bar ──────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          
        {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            {/* This loads your image from the public folder! */}
            <img 
              src="/logo.png" 
              alt="MaxRBX Logo" 
              className="h-8 w-auto transition-all duration-200 group-hover:brightness-110"
            />
            <span className="text-base font-extrabold tracking-tight text-white">
              Max<span style={{ color: '#39FF14' }}>RBX</span>
            </span>
          </Link>

          {/* Desktop centre links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  color: isActive(link.href) ? '#39FF14' : 'rgba(255,255,255,0.55)',
                  backgroundColor: isActive(link.href) ? 'rgba(57,255,20,0.08)' : 'transparent',
                }}
              >{link.label}</Link>
            ))}
          </div>

          {/* Desktop right — auth (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {!hydrated ? (
              <div className="w-28 h-9 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            ) : user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen((v) => !v)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-200"
                  style={{
                    backgroundColor: '#13151A',
                    borderColor: dropOpen ? 'rgba(57,255,20,0.4)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: 'rgba(57,255,20,0.4)' }}>
                    {user.avatarUrl ? (
                      <Image src={user.avatarUrl} alt={user.username} width={28} height={28} className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: '#39FF14' }}>
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-none">{user.username}</p>
                    <p className="text-[10px] mt-0.5 font-semibold" style={{ color: '#39FF14' }}>{user.points ?? 0} R$</p>
                  </div>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ color: 'rgba(255,255,255,0.35)', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border overflow-hidden shadow-2xl"
                    style={{
                      backgroundColor: '#0F1117',
                      borderColor: 'rgba(255,255,255,0.1)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(57,255,20,0.08)',
                      animation: 'slideDown 0.18s ease forwards',
                    }}
                  >
                    <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(57,255,20,0.4), transparent)' }} />
                    <div className="p-1">
                      <Link
                        href="/account"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/5"
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(57,255,20,0.1)' }}>👤</span>
                        Account
                      </Link>
                      <div className="h-px mx-2 my-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 hover:bg-red-500/10"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>🚪</span>
                        <span className="hover:text-red-400 transition-colors">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: '#39FF14' }}
              >Sign In</button>
            )}
          </div>

          {/* Mobile right — hamburger (hidden on desktop) */}
          <div className="flex md:hidden items-center gap-3">
            {/* Show avatar pill on mobile too when logged in */}
            {hydrated && user && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border" style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="w-6 h-6 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: 'rgba(57,255,20,0.4)' }}>
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt={user.username} width={24} height={24} className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-black" style={{ backgroundColor: '#39FF14' }}>
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold" style={{ color: '#39FF14' }}>{user.points ?? 0} R$</span>
              </div>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200"
              style={{
                backgroundColor: mobileOpen ? 'rgba(57,255,20,0.08)' : '#13151A',
                borderColor: mobileOpen ? 'rgba(57,255,20,0.35)' : 'rgba(255,255,255,0.1)',
              }}
              aria-label="Toggle menu"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ────────────────────────────────────────────────── */}
        {mobileOpen && (
          <div
            className="md:hidden border-t mobile-menu-enter"
            style={{ borderColor: 'rgba(255,255,255,0.07)', backgroundColor: '#0B0C10' }}
          >
            <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-2">

              {/* Nav links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: isActive(link.href) ? 'rgba(57,255,20,0.08)' : 'rgba(255,255,255,0.03)',
                    color: isActive(link.href) ? '#39FF14' : 'rgba(255,255,255,0.75)',
                    border: `1px solid ${isActive(link.href) ? 'rgba(57,255,20,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                  {isActive(link.href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#39FF14' }} />
                  )}
                </Link>
              ))}

              {/* Divider */}
              <div className="h-px my-1" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />

              {/* Auth section */}
              {!hydrated ? (
                <div className="h-12 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
              ) : user ? (
                <>
                  {/* User info row */}
                  <div
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border"
                    style={{ backgroundColor: 'rgba(57,255,20,0.04)', borderColor: 'rgba(57,255,20,0.15)' }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: '#39FF14' }}>
                      {user.avatarUrl ? (
                        <Image src={user.avatarUrl} alt={user.username} width={40} height={40} className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-black" style={{ backgroundColor: '#39FF14' }}>
                          {user.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.username}</p>
                      <p className="text-xs font-semibold" style={{ color: '#39FF14' }}>{user.points ?? 0} R$ balance</p>
                    </div>
                  </div>

                  {/* Account link */}
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-white transition-colors duration-150"
                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-base">👤</span>
                    Account Settings
                    <svg className="ml-auto w-4 h-4 opacity-30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors duration-150"
                    style={{
                      backgroundColor: 'rgba(239,68,68,0.05)',
                      border: '1px solid rgba(239,68,68,0.15)',
                      color: 'rgba(239,100,100,0.9)',
                    }}
                  >
                    <span className="text-base">🚪</span>
                    Logout
                  </button>
                </>
              ) : (
                /* Logged-out CTA */
                <button
                  onClick={() => { setMobileOpen(false); setModalOpen(true); }}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-black transition-all duration-200 hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: '#39FF14' }}
                >
                  Sign In to Start Earning
                </button>
              )}

              {/* Bottom padding */}
              <div className="h-1" />
            </div>
          </div>
        )}
      </nav>

      {/* Login modal */}
      {modalOpen && (
        <LoginModal onClose={() => setModalOpen(false)} onSuccess={handleLoginSuccess} />
      )}
    </>
  );
}
