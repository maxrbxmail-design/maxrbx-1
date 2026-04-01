/**
 * app/api/complete-offer/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Called by your offerwall postback / server-to-server callback when a user
 * completes a task and earns Robux.
 *
 * IMPORTANT — Postback Security:
 *   Real offerwalls send a secret key with every postback so you can verify
 *   the request is genuine. Set OFFERWALL_SECRET in your Vercel env vars and
 *   each offerwall's dashboard, then uncomment the signature check below.
 *
 * Expected POST body:
 *   {
 *     userId:   number,   // Roblox userId of the earner
 *     amount:   number,   // R$ earned (integer)
 *     offerKey: string,   // unique ID for this completion, e.g. "cpagraph_TXN_abc123"
 *     secret:   string    // must match process.env.OFFERWALL_SECRET
 *   }
 */

import { NextResponse } from 'next/server';
import { getUsersCollection, payReferralBonus } from '@/lib/referral';

export async function POST(request) {
  try {
    const { userId, amount, offerKey, secret } = await request.json();

    // ── 1. Shared-secret verification ─────────────────────────────────────
    //    Uncomment once you've added OFFERWALL_SECRET to Vercel env vars:
    //
    // if (!secret || secret !== process.env.OFFERWALL_SECRET) {
    //   return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    // }

    if (!userId || !amount || amount <= 0 || !offerKey) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const users = await getUsersCollection();

    // ── 2. Idempotency — reject duplicate offerKey ─────────────────────────
    const duplicate = await users.findOne({ completedOffers: offerKey });
    if (duplicate) {
      // Return 200 so the offerwall doesn't keep retrying
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const parsedUserId = Number(userId);
    const parsedAmount = Math.floor(Number(amount));

    // ── 3. Credit earner ──────────────────────────────────────────────────
    const earnerResult = await users.updateOne(
      { userId: parsedUserId },
      {
        $inc: {
          points:           parsedAmount,
          lifetimeEarnings: parsedAmount,
        },
        $addToSet: { completedOffers: offerKey },
      }
    );

    if (earnerResult.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // ── 4. Pay referral bonus (15 %) — fully guarded inside payReferralBonus
    const referralResult = await payReferralBonus(parsedUserId, parsedAmount, offerKey);

    return NextResponse.json({
      ok:             true,
      credited:       parsedAmount,
      referralBonus:  referralResult?.bonusPaid ?? 0,
      referrerId:     referralResult?.referrerUserId ?? null,
    });

  } catch (err) {
    console.error('[/api/complete-offer]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
