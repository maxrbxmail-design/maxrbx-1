import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { error: 'Username is required.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();

    // -------------------------------------------------------------------------
    // STEP 1 — Resolve Roblox username → userId via the Users API
    // -------------------------------------------------------------------------
    const usersRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernames: [cleanUsername],
        excludeBannedUsers: false,
      }),
    });

    if (!usersRes.ok) {
      return NextResponse.json(
        { error: 'Failed to reach Roblox API. Try again later.' },
        { status: 502 }
      );
    }

    const usersData = await usersRes.json();

    if (!usersData.data || usersData.data.length === 0) {
      return NextResponse.json(
        { error: 'Roblox user not found. Check the username and try again.' },
        { status: 404 }
      );
    }

    const { id: userId, name: resolvedUsername } = usersData.data[0];

    // -------------------------------------------------------------------------
    // STEP 2 — Fetch circular avatar headshot from Roblox Thumbnails API
    // -------------------------------------------------------------------------
    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot` +
        `?userIds=${userId}&size=150x150&format=Png&isCircular=true`
    );

    let avatarUrl = null;

    if (thumbRes.ok) {
      const thumbData = await thumbRes.json();
      if (thumbData.data && thumbData.data.length > 0) {
        avatarUrl = thumbData.data[0].imageUrl ?? null;
      }
    }
    // Non-fatal: if avatar fetch fails we still log the user in

    // -------------------------------------------------------------------------
    // STEP 3 — Upsert user document in MongoDB
    // -------------------------------------------------------------------------
    const mongoClient = await clientPromise;
    const db = mongoClient.db('robroux');           // ← change DB name if needed
    const users = db.collection('users');

    await users.updateOne(
      { userId },                                   // filter — match on Roblox userId
      {
        $set: {
          username: resolvedUsername,               // use the canonical casing from Roblox
          avatarUrl,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId,
          points: 0,                                // only set on first creation
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // -------------------------------------------------------------------------
    // STEP 4 — Set an HTTP-only session cookie with the userId
    // -------------------------------------------------------------------------
    const cookieStore = await cookies();
    cookieStore.set('robroux_session', String(userId), {
      httpOnly: true,       // not accessible via JS — prevents XSS theft
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      ok: true,
      username: resolvedUsername,
      userId,
      avatarUrl,
    });
  } catch (err) {
    console.error('[/api/login] Unhandled error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
