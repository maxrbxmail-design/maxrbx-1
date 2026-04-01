'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// ─── Micro components ─────────────────────────────────────────────────────────

function StatBox({ label, value, accent }) {
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded-xl border"
      style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {label}
      </span>
      <span
        className="text-xl font-extrabold tracking-tight"
        style={{ color: accent ? '#39FF14' : '#fff' }}
      >
        {value}
      </span>
    </div>
  );
}

// Sparkline — pure CSS/SVG placeholder line chart
function EarningsChart() {
  // Static decorative sparkline — replace with recharts/Chart.js when data is live
  const points = [30, 55, 40, 70, 60, 90, 75, 95, 80, 100, 88, 110];
  const max = Math.max(...points);
  const w = 600; const h = 120;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - (v / max) * (h - 16));
  const d  = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const fill = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
    + ` L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height: 120 }}>
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#39FF14" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#39FF14" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#chartFill)" />
      <path d={d} fill="none" stroke="#39FF14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3" fill="#39FF14" opacity={i === points.length - 1 ? 1 : 0.4} />
      ))}
    </svg>
  );
}

function SectionCard({ title, children }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode]       = useState('');
  const [promoMsg, setPromoMsg]         = useState(null); // { type: 'success'|'error', text: string }
  const [promoLoading, setPromoLoading] = useState(false);
  const [copied, setCopied]             = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then((r) => { if (r.status === 401) { router.push('/'); return null; } return r.json(); })
      .then((d) => { if (d?.user) setUser(d.user); })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [router]);

  const handlePromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoMsg({ type: 'error', text: 'Please enter a promo code.' });
      return;
    }
    setPromoLoading(true);
    setPromoMsg(null);
    try {
      const res  = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        setPromoMsg({ type: 'success', text: data.message ?? 'Code redeemed! Your balance has been updated.' });
        setPromoCode('');
        // Re-fetch user so sidebar balance updates live
        fetch('/api/me').then((r) => r.json()).then((d) => { if (d?.user) setUser(d.user); });
      } else {
        setPromoMsg({ type: 'error', text: data.error ?? 'Invalid or already redeemed code.' });
      }
    } catch {
      setPromoMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setPromoLoading(false);
    }
  };

  const referralLink = user
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://maxrbx.com'}/r/${user.username}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#0B0C10' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#39FF14', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 sm:px-6 py-10" style={{ backgroundColor: '#0B0C10' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Page title ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#39FF14' }}>
            MaxRBX
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">My Account</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* ══ LEFT SIDEBAR — Profile card ════════════════════════════════ */}
          <div className="flex flex-col gap-5">

            {/* Profile card */}
            <div
              className="rounded-2xl border relative overflow-hidden"
              style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {/* Top glow */}
              <div
                className="absolute inset-x-0 top-0 h-20 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(57,255,20,0.12) 0%, transparent 70%)' }}
              />

              <div className="p-6 flex flex-col items-center text-center relative">
                {/* Avatar */}
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border-2 mb-4 shadow-lg"
                  style={{
                    borderColor: '#39FF14',
                    boxShadow: '0 0 24px rgba(57,255,20,0.25)',
                  }}
                >
                  {user?.avatarUrl ? (
                    <Image src={user.avatarUrl} alt={user.username} width={96} height={96} className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-black" style={{ backgroundColor: '#39FF14' }}>
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                <h2 className="text-lg font-extrabold text-white">{user?.username}</h2>
                <p className="text-xs mt-0.5 mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Verified Roblox Account</p>

                {/* Divider */}
                <div className="w-full h-px mb-5" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }} />

                {/* Stats grid */}
                <div className="w-full grid grid-cols-2 gap-3">
                  <StatBox label="Offers Done"  value="0"                          />
                  <StatBox label="Referrals"     value="0"                          />
                  <StatBox label="R$ Balance"    value={`${user?.points ?? 0} R$`} accent />
                  <StatBox label="R$ Lifetime"   value={`${user?.points ?? 0} R$`} accent />
                </div>
              </div>
            </div>

            {/* Quick nav card */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {[
                { icon: '💰', label: 'Earn Robux',  href: '/dashboard' },
                { icon: '💸', label: 'Withdraw',    href: '/withdraw'  },
                { icon: '🏠', label: 'Home',        href: '/'          },
              ].map((item, i, arr) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-colors duration-150 hover:bg-white/5"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                  <svg className="ml-auto w-3.5 h-3.5 opacity-30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* ══ RIGHT — Main content ════════════════════════════════════════ */}
          <div className="flex flex-col gap-6">

            {/* Top row: Promo + Referral */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Promo Code */}
              <SectionCard title="🎟 Redeem Promo Code">
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Enter a promo code to claim bonus R$.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !promoLoading) handlePromo(); }}
                    placeholder="MAXRBX2025"
                    disabled={promoLoading}
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none border transition-all duration-200 disabled:opacity-50"
                    style={{
                      backgroundColor: '#1A1D27',
                      borderColor: promoMsg?.type === 'error'
                        ? 'rgba(239,68,68,0.45)'
                        : promoMsg?.type === 'success'
                        ? 'rgba(57,255,20,0.35)'
                        : 'rgba(255,255,255,0.08)',
                    }}
                  />
                  <button
                    onClick={handlePromo}
                    disabled={promoLoading}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110 active:scale-95 flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{ backgroundColor: '#39FF14', minWidth: '90px', justifyContent: 'center' }}
                  >
                    {promoLoading ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Checking
                      </>
                    ) : 'Redeem'}
                  </button>
                </div>

                {/* Feedback message */}
                {promoMsg && (
                  <div
                    className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold"
                    style={{
                      backgroundColor: promoMsg.type === 'success'
                        ? 'rgba(57,255,20,0.08)'
                        : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${promoMsg.type === 'success' ? 'rgba(57,255,20,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      color: promoMsg.type === 'success' ? '#39FF14' : '#f87171',
                    }}
                  >
                    <span className="flex-shrink-0 mt-px">
                      {promoMsg.type === 'success' ? '✓' : '✕'}
                    </span>
                    {promoMsg.text}
                  </div>
                )}
              </SectionCard>

              {/* Referral Link */}
              <SectionCard title="🔗 Your Referral Link">
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Share your link. Earn R$ for every friend who joins.
                </p>
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm overflow-hidden"
                  style={{ backgroundColor: '#1A1D27', borderColor: 'rgba(57,255,20,0.2)' }}
                >
                  <span className="flex-1 truncate text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {referralLink}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-black transition-all hover:brightness-110"
                    style={{ backgroundColor: copied ? 'rgba(57,255,20,0.7)' : '#39FF14' }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  You'll receive a bonus when your referral completes their first offer.
                </p>
              </SectionCard>
            </div>

            {/* Earnings Chart */}
            <SectionCard title="📈 Earnings Overview">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Last 12 sessions</p>
                  <p className="text-2xl font-extrabold" style={{ color: '#39FF14' }}>
                    {user?.points ?? 0} R$
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(57,255,20,0.1)', color: '#39FF14' }}
                >
                  Live Soon
                </span>
              </div>

              {/* Chart area */}
              <div
                className="rounded-xl overflow-hidden p-4 border"
                style={{ backgroundColor: '#0B0C10', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <EarningsChart />
                {/* X axis labels */}
                <div className="flex justify-between mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                    <span key={m} className="text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{m}</span>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* Activity History */}
            <SectionCard title="📋 Activity History">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['Date', 'Task', 'Provider', 'Reward', 'Status'].map((h) => (
                        <th
                          key={h}
                          className="pb-3 text-left text-[10px] font-bold tracking-widest uppercase"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty state */}
                    <tr>
                      <td colSpan={5}>
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: 'rgba(57,255,20,0.07)', border: '1px solid rgba(57,255,20,0.12)' }}
                          >
                            📭
                          </div>
                          <p className="font-semibold text-white text-sm">No activity yet</p>
                          <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            Complete your first offer on the{' '}
                            <a href="/dashboard" className="underline" style={{ color: '#39FF14' }}>Earn page</a>{' '}
                            to see your history here.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  );
}
