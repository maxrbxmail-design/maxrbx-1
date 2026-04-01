/**
 * lib/referral.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared referral utilities used by API routes.
 * Keep this server-side only — never import into Client Components.
 */

import clientPromise from '@/lib/mongodb';

// ── Constants ─────────────────────────────────────────────────────────────────

export const REFERRAL_BONUS_RATE  = 0.15;   // 15 % of referred user's earnings
export const REFERRAL_COOKIE_NAME = 'maxrbx_ref';
export const REFERRAL_COOKIE_TTL  = 60 * 60 * 24 * 30; // 30 days in seconds

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Return the `users` collection from the shared client.
 */
export async function getUsersCollection() {
  const client = await clientPromise;
  return client.db('robroux').collection('users');
}

/**
 * Look up a user by their Roblox userId.
 * Returns null if not found.
 */
export async function findUserById(userId) {
  const users = await getUsersCollection();
  return users.findOne({ userId: Number(userId) });
}

/**
 * Look up a user by their Roblox username (case-insensitive).
 * Returns null if not found.
 */
export async function findUserByUsername(username) {
  const users = await getUsersCollection();
  return users.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
}

/**
 * Award a referral bonus to the referrer.
 *
 * Security rules enforced here:
 *  1. Referrer must exist.
 *  2. Earner must exist and must have a `referredBy` field pointing to referrer.
 *  3. The referrer cannot be the same person as the earner (self-referral).
 *  4. Each offer completion is tracked in a `referralPaidOffers` set so the
 *     same offer cannot be double-counted.
 *
 * @param {number} earnerUserId   - userId of the user who just earned Robux
 * @param {number} earnedAmount   - how many R$ the earner just received
 * @param {string} offerKey       - unique string identifying this specific offer completion
 * @returns {{ bonusPaid: number, referrerUserId: number } | null}
 */
export async function payReferralBonus(earnerUserId, earnedAmount, offerKey) {
  if (!earnerUserId || !earnedAmount || earnedAmount <= 0 || !offerKey) return null;

  const users = await getUsersCollection();

  // Fetch earner
  const earner = await users.findOne({ userId: Number(earnerUserId) });
  if (!earner || !earner.referredBy) return null;          // no referrer on record

  const referrerUserId = Number(earner.referredBy);

  // Self-referral guard (belt-and-suspenders — also blocked on registration)
  if (referrerUserId === Number(earnerUserId)) return null;

  // Idempotency: bail if we already paid for this exact offer completion
  const alreadyPaid = await users.findOne({
    userId: referrerUserId,
    referralPaidOffers: offerKey,
  });
  if (alreadyPaid) return null;

  const bonus = Math.floor(earnedAmount * REFERRAL_BONUS_RATE); // always integer R$
  if (bonus <= 0) return null;

  // Atomically credit bonus and record the offer key
  const result = await users.updateOne(
    { userId: referrerUserId },
    {
      $inc: { points: bonus, lifetimeReferralEarnings: bonus },
      $addToSet: { referralPaidOffers: offerKey },
    }
  );

  if (result.modifiedCount === 0) return null;

  return { bonusPaid: bonus, referrerUserId };
}
