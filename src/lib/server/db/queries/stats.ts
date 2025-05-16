import { db } from '../db';
import { users, votes, groups, acts, categories } from '../schema';
import { sql } from 'drizzle-orm';

export async function getAdminStats() {
  const [
    totalUsers,
    totalVotes,
    totalGroups,
    totalActs,
    totalCategories,
    votesToday,
    newUsersToday
  ] = await Promise.all([
    // Total users
    db.select({ count: sql<number>`count(*)` }).from(users),
    
    // Total votes
    db.select({ count: sql<number>`count(*)` }).from(votes),
    
    // Total groups
    db.select({ count: sql<number>`count(*)` }).from(groups),
    
    // Total acts
    db.select({ count: sql<number>`count(*)` }).from(acts),
    
    // Total categories
    db.select({ count: sql<number>`count(*)` }).from(categories),
    
    // Votes today
    db.select({ count: sql<number>`count(*)` })
      .from(votes)
      .where(sql`date_trunc('day', ${votes.created_at}) = date_trunc('day', now())`),
    
    // New users today
    db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`date_trunc('day', ${users.created_at}) = date_trunc('day', now())`)
  ]);

  return {
    totalUsers: totalUsers[0].count,
    totalVotes: totalVotes[0].count,
    totalGroups: totalGroups[0].count,
    totalActs: totalActs[0].count,
    totalCategories: totalCategories[0].count,
    votesToday: votesToday[0].count,
    newUsersToday: newUsersToday[0].count
  };
} 