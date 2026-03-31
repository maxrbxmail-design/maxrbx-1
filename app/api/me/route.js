import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('robroux_session');

    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const userId = parseInt(session.value, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db('robroux');
    const user = await db.collection('users').findOne(
      { userId },
      { projection: { _id: 0, userId: 1, username: 1, avatarUrl: 1, points: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error('[/api/me] Unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
