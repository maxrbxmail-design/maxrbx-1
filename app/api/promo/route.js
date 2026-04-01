import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    // 1. Get the promo code from the request body
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'Please enter a code.' }, { status: 400 });
    }

    // 2. Check if the user is logged in
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('robroux_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    const userId = Number(sessionCookie.value);

    // 3. Connect to MongoDB
    const mongoClient = await clientPromise;
    const db = mongoClient.db('robroux'); // Ensure this matches your DB name!
    const promoCollection = db.collection('promocodes');
    const usersCollection = db.collection('users');

    // 4. Find the promo code (making it case-insensitive just in case)
    const promo = await promoCollection.findOne({ 
      code: { $regex: `^${code}$`, $options: 'i' } 
    });

    if (!promo) {
      return NextResponse.json({ error: 'Invalid promo code.' }, { status: 400 });
    }

    // 5. Check if the code is maxed out
    if (promo.currentClaims >= promo.maxClaims) {
      return NextResponse.json({ error: 'This code has expired.' }, { status: 400 });
    }

    // 6. Check if this user already claimed it
    if (promo.claimedBy && promo.claimedBy.includes(userId)) {
      return NextResponse.json({ error: 'You have already used this code.' }, { status: 400 });
    }

    // 7. EVERYTHING IS GOOD! Let's update the database.
    
    // Give the user the points
    await usersCollection.updateOne(
      { userId: userId },
      { $inc: { points: promo.points } }
    );

    // Mark the code as claimed by this user
    await promoCollection.updateOne(
      { _id: promo._id },
      { 
        $inc: { currentClaims: 1 },
        $push: { claimedBy: userId }
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Successfully redeemed! Added R$ ${promo.points} to your account.` 
    });

  } catch (error) {
    console.error('[/api/promo] Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
