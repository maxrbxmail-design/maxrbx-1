/**
 * app/api/login/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Registers or updates a user via Roblox username lookup.
 * Handles referral attribution on first-time registration.
 */

import { NextResponse } from 'next/server';
import { cookies }      from 'next/headers';
import clientPromise    from '@/lib/mongodb';
import { REFERRAL_COOKIE_NAME, REFERRAL_COOKIE_TTL } from '@/lib/referral';

export async function POST(request) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    const cleanUsername = username.trim();

    // ── 1. Resolve username → userId via Roblox API ────────────────────────
    const usersRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [cleanUsername], excludeBannedUsers: false }),
    });

    if (!usersRes.ok) {
      return NextResponse.json({ error: 'Failed to reach Roblox API. Try again later.' }, { status: 502 });
    }

    const usersData = await usersRes.json();
    if (!usersData.data || usersData.data.length === 0) {
      return NextResponse.json({ error: 'Roblox user not found. Check the username and try again.' }, { status: 404 });
    }

    const { id: userId, name: resolvedUsername } = usersData.data[0];

    // ── 2. Fetch Roblox avatar thumbnail ───────────────────────────────────
    let avatarUrl = null;
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`
      );
      if (thumbRes.ok) {
        const thumbData = await thumbRes.json();
        avatarUrl = thumbData.data?.[0]?.imageUrl ?? null;
      }
    } catch { /* non-fatal */ }

    // ── 3. Read referral cookie (set by /r/[username] page) ────────────────
    const cookieStore  = await cookies();
    const refCookie    = cookieStore.get(REFERRAL_COOKIE_NAME);
    const referrerId   = refCookie?.value ? Number(refCookie.value) : null;

    // ── 4. Check if user already exists ───────────────────────────────────
    const mongoClient = await clientPromise;
    const db    = mongoClient.db('robroux');
    const users = db.collection('users');

    const existingUser = await users.findOne({ userId });
    const isNewUser    = !existingUser;

    // ── 5. Build referredBy — only for brand-new users, never overwrite ────
    let referredBy = existingUser?.referredBy ?? null;

    if (isNewUser && referrerId) {
      // Security: cannot refer yourself
      if (referrerId !== userId) {
        // Verify referrer actually exists in our DB
        const referrerExists = await users.findOne({ userId: referrerId });
        if (referrerExists) {
          referredBy = referrerId;
        }
      }
    }

    // ── 6. Upsert user document ────────────────────────────────────────────
    const now = new Date();
    await users.updateOne(
      { userId },
      {
        $set: {
          username: resolvedUsername,
          avatarUrl,
          updatedAt: now,
          ...(referredBy !== null && isNewUser ? { referredBy } : {}),
        },
        $setOnInsert: {
          userId,
          points:   0,
          lifetimeEarnings:         0,
          lifetimeReferralEarnings: 0,
          referralCount:            0,
          referralPaidOffers:       [],
          createdAt: now,
        },
      },
      { upsert: true }
    );

    // ── 7. If new user with a valid referrer, increment referrer's count ───
    if (isNewUser && referredBy) {
      await users.updateOne(
        { userId: referredBy },
        { $inc: { referralCount: 1 } }
      );
      // Clear the referral cookie — it's been consumed
      cookieStore.set(REFERRAL_COOKIE_NAME, '', {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path:     '/',
        maxAge:   0,
      });
    }

    // ── 8. Set session cookie ──────────────────────────────────────────────
    cookieStore.set('robroux_session', String(userId), {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ ok: true, username: resolvedUsername, userId, avatarUrl });

  } catch (err) {
    console.error('[/api/login]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
