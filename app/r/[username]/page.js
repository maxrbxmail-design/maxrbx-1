/**
 * app/r/[username]/page.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Referral landing page — visited when someone clicks a referral link.
 *
 * This is a SERVER COMPONENT so it can:
 *  - Validate the referrer exists in MongoDB before setting anything
 *  - Set an httpOnly referral cookie securely
 *  - Immediately redirect to the homepage
 *
 * The cookie is later read by /api/login when the new user registers.
 */

import { cookies }   from 'next/headers';
import { redirect }  from 'next/navigation';
import {
  findUserByUsername,
  REFERRAL_COOKIE_NAME,
  REFERRAL_COOKIE_TTL,
} from '@/lib/referral';

export default async function ReferralPage({ params }) {
  const { username } = await params;

  if (username) {
    try {
      // Only set the cookie if the referrer is a real, existing user
      const referrer = await findUserByUsername(decodeURIComponent(username));

      if (referrer?.userId) {
        const cookieStore = await cookies();

        // Don't overwrite an existing referral cookie (first-click wins)
        const existing = cookieStore.get(REFERRAL_COOKIE_NAME);
        if (!existing?.value) {
          cookieStore.set(REFERRAL_COOKIE_NAME, String(referrer.userId), {
            httpOnly: true,                                   // JS can't read it
            secure:   process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path:     '/',
            maxAge:   REFERRAL_COOKIE_TTL,                   // 30 days
          });
        }
      }
    } catch (err) {
      console.error('[/r/[username]]', err);
      // Non-fatal — just redirect without setting cookie
    }
  }

  // Always redirect to the homepage regardless of outcome
  redirect('/');
}
