'use client';

import { useState } from 'react';
import Link from 'next/link';

function NavLink({ label }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-white/50 hover:text-cyan-400 text-xs tracking-[0.25em] uppercase transition-colors duration-200"
      >
        {label}
      </button>
      {show && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50">
          <div className="bg-black border border-cyan-400/40 px-3 py-1.5 whitespace-nowrap text-cyan-400 text-[10px] tracking-widest uppercase shadow-[0_0_12px_rgba(0,255,255,0.15)]">
            Coming Soon
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
<Link href="/" className="flex items-center gap-3 group">
  <span className="logo-box w-9 h-9 flex items-center justify-center border border-cyan-400/50 group-hover:border-cyan-400 transition-all duration-300">
    <img src="/max.png" alt="ROBROUX Logo" className="h-full w-auto" />
  </span>

  <span className="chrome-text text-lg font-bold tracking-[0.15em] uppercase">
    MaxRBX
  </span>
</Link>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-white/50 hover:text-cyan-400 text-xs tracking-[0.25em] uppercase transition-colors duration-200"
          >
            Home
          </Link>
          <NavLink label="Earn" />
          <NavLink label="Withdraw" />
        </div>
      </div>
    </nav>
  );
}
