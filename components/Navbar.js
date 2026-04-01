'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  // ─── 1. USER & UI STATE ──────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState('');
  const [robuxBalance, setRobuxBalance] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [inputUsername, setInputUsername] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

// ─── EXISTING SESSION CHECK ─────────────────────────────────────────────
  useEffect(() => {
    // Hits your /api/me to see if a session cookie already exists
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setIsLoggedIn(true);
          setUsername(data.user.username);
          setRobuxBalance(data.user.points || 0);
          setAvatarUrl(data.user.avatarUrl || '');
        }
      })
      .catch(() => console.log('Not logged in.'));
  }, []);

  // ─── CLAUDE'S NEW EVENT LISTENER (ADD THIS!) ───────────────────────────
  useEffect(() => {
    const handler = () => setShowLoginModal(true); 
    
    window.addEventListener('maxrbx:open-login', handler);
    return () => window.removeEventListener('maxrbx:open-login', handler);
  }, []);

  // ─── 3. HANDLE LOGIN (Hits your actual API) ───────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputUsername }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to log in');
      }

      // Success! Update Navbar state
      setIsLoggedIn(true);
      setUsername(data.username);
      setAvatarUrl(data.avatarUrl || '');
      setRobuxBalance(0); // New users start at 0
      
      setShowLoginModal(false);
      
      // Send them straight to the dashboard now that they are logged in!
      router.push('/dashboard');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEarnClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <>
      <nav className="border-b border-white/5 bg-[#0B0C10] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center transition-all duration-300">
              <img src="/max.png" alt="MaxRBX Logo" className="h-full w-auto object-contain" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-white">
              MaxRBX
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-white/60 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors">
              Home
            </Link>

            <button onClick={handleEarnClick} className="text-white/60 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors">
              Earn
            </button>

            <button onClick={handleEarnClick} className="text-white/60 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors">
              Withdraw
            </button>

            <a href="https://discord.gg/your-invite" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors">
              Discord
            </a>

            <div className="ml-2 h-6 w-px bg-white/10" />

            {/* DYNAMIC USER INTERFACE */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 bg-[#13151A] border border-white/10 p-1 pr-3.5 rounded-xl">
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
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs font-bold px-5 py-2.5 hover:brightness-110 transition-all rounded-lg text-black uppercase tracking-wider"
                style={{ backgroundColor: '#39FF14' }}
              >
                Start Earning
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── PLANETRBX STYLE LOGIN MODAL ─────────────────────────────────── */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-[#13151A] border border-white/5 p-8 rounded-2xl w-full max-w-md relative shadow-[0_0_50px_rgba(57,255,20,0.05)]">
            
            <button 
              onClick={() => { setShowLoginModal(false); setLoginError(''); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-extrabold mb-2 text-center text-white tracking-tight">Link Your Account</h3>
            <p className="text-white/50 text-xs text-center mb-6 tracking-wide">Enter your Roblox username to continue. We will never ask for your password.</p>
            
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <input 
                type="text"
                placeholder="Roblox Username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="bg-[#0B0C10] border border-white/5 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#39FF14]/40 transition-colors"
                required
                disabled={loginLoading}
              />
              
              {loginError && (
                <p className="text-red-500 text-xs text-center font-medium">{loginError}</p>
              )}

              <button 
                type="submit"
                className="font-bold py-3 rounded-lg hover:brightness-110 transition-colors text-black text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#39FF14' }}
                disabled={loginLoading}
              >
                {loginLoading ? 'Locating User...' : 'Proceed to Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
