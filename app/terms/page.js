'use client';

export default function TermsOfService() {
  return (
    <div className="min-h-[calc(100vh-64px)] px-4 sm:px-6 py-10" style={{ backgroundColor: '#0B0C10' }}>
      <div className="max-w-4xl mx-auto rounded-2xl border p-8 sm:p-10" style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#39FF14' }}>Legal</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-6">Terms of Service</h1>
        
        <div className="text-sm space-y-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <p>Last Updated: April 2026</p>
          <p>By accessing or using MaxRBX, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using the platform.</p>
          
          <h2 className="text-white font-bold text-lg mt-4">1. Eligibility and Account</h2>
          <p>You must have a valid Roblox account to use our services. You are responsible for maintaining the security of your logged-in session. MaxRBX is not affiliated with, endorsed, or sponsored by Roblox Corporation.</p>
          
          <h2 className="text-white font-bold text-lg mt-4">2. Offer Completion and Payouts</h2>
          <p>Robux (R$) are awarded automatically only after our third-party offerwall networks verify and confirm a successful task completion. Any attempt to exploit, use automated bots, or use VPNs to fake completions will result in a permanent ban and forfeit of all earned points.</p>
          
          <h2 className="text-white font-bold text-lg mt-4">3. Referral System</h2>
          <p>Users may share their unique referral link to earn 15% of their referred friends' earnings. Creating fake accounts to refer yourself is strictly prohibited and audited automatically by our system.</p>
        </div>
      </div>
    </div>
  );
}
