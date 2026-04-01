'use client';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[calc(100vh-64px)] px-4 sm:px-6 py-10" style={{ backgroundColor: '#0B0C10' }}>
      <div className="max-w-4xl mx-auto rounded-2xl border p-8 sm:p-10" style={{ backgroundColor: '#13151A', borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#39FF14' }}>Legal</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-6">Privacy Policy</h1>
        
        <div className="text-sm space-y-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <p>Last Updated: April 2026</p>
          <p>At MaxRBX, accessible from your domain, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by MaxRBX and how we use it.</p>
          
          <h2 className="text-white font-bold text-lg mt-4">1. Information We Collect</h2>
          <p>We only collect public Roblox profile information (User ID, Username, and Avatar) when you log in. We do not ask for or store your Roblox passwords or personal email addresses.</p>
          
          <h2 className="text-white font-bold text-lg mt-4">2. Third-Party Offerwalls</h2>
          <p>MaxRBX uses third-party offerwall providers to supply tasks and surveys. When you click on an offerwall, you are interacting with a third-party service that may collect your IP address, device ID, and usage data according to their own privacy policies.</p>
          
          <h2 className="text-white font-bold text-lg mt-4">3. Cookies</h2>
          <p>We use essential HTTP-only cookies to keep you logged in and to securely track referrals. These cookies do not store any personal identification data and cannot be accessed by external scripts.</p>
        </div>
      </div>
    </div>
  );
}
