/**
 * app/api/referral/stats/route.js
 * Returns the logged-in user's referral stats for the account page.
 */

import { NextResponse } from 'next/server';
import { cookies }      from 'next/headers';
import { findUserById } from '@/lib/referral';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session     = cookieStore.get('robroux_session');

    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const user = await findUserById(Number(session.value));
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      stats: {
        referralCount:            user.referralCount            ?? 0,
        lifetimeReferralEarnings: user.lifetimeReferralEarnings ?? 0,
      },
    });
  } catch (err) {
    console.error('[/api/referral/stats]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
