import Image from 'next/image';
import Link from 'next/link';

// ─── Static data (Claude's awesome content!) ──────────────────────────────────

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
  return (
    <div className="min-h-screen text-white relative" style={{ backgroundColor: '#0B0C10' }}>
      
      {/* NO NAV BAR HERE! 
        Your global navigation component handles the top of the screen automatically.
      */}

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
            {/* Routing directly to your working dashboard login flow */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-black transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ backgroundColor: '#39FF14' }}
            >
              Start Earning
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

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
    </div>
  );
}



      {/* ── SOCIAL PROOF ──────────────────────────────────────────────────── */}
      <section
        className="border-t py-24"
        style={{ borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.015)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#39FF14' }}>
              Real Users, Real Rewards
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              What Our Community Says
            </h2>
            <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Join thousands of players already earning for free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((r) => (
              <div
                key={r.name}
                className="rounded-2xl p-6 border flex flex-col"
                style={{
                  backgroundColor: '#13151A',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <StarRating count={r.rating} />

                <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  "{r.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-black flex-shrink-0"
                    style={{ backgroundColor: '#39FF14' }}
                  >
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Verified User</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div
          className="rounded-3xl p-12 text-center border relative overflow-hidden"
          style={{
            backgroundColor: '#13151A',
            borderColor: 'rgba(57,255,20,0.2)',
          }}
        >
          {/* Subtle glow behind */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(57,255,20,0.08) 0%, transparent 70%)' }}
          />

          <h2 className="relative text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to start earning{' '}
            <span style={{ color: '#39FF14' }}>for free?</span>
          </h2>
          <p className="relative text-base mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
            No password. No credit card. Just Robux.
          </p>
          <Link
            href="/dashboard"
            className="relative inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-black transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{ backgroundColor: '#39FF14' }}
          >
            Start Earning Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

