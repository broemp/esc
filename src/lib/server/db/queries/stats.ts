import { db } from '../db';
import { users, votes, groups, acts, categories, countries, userInGroups } from '../schema';
import { sql, eq, desc, asc } from 'drizzle-orm';

export async function getAdminStats() {
  const [
    totalUsers,
    totalVotes,
    totalGroups,
    totalActs,
    totalCategories,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(votes),
    db.select({ count: sql<number>`count(*)` }).from(groups),
    db.select({ count: sql<number>`count(*)` }).from(acts),
    db.select({ count: sql<number>`count(*)` }).from(categories),
  ]);

  return {
    totalUsers: totalUsers[0].count,
    totalVotes: totalVotes[0].count,
    totalGroups: totalGroups[0].count,
    totalActs: totalActs[0].count,
    totalCategories: totalCategories[0].count,
  };
}

export async function getUserStats(userId: string) {
  const [overall, byCat, topActs, bottomActs] = await Promise.all([
    db.select({
      totalVotes: sql<number>`count(*)::int`,
      avgScore: sql<number>`cast(avg(${votes.points}) as decimal(10,2))`,
      maxScore: sql<number>`cast(max(${votes.points}) as decimal(10,2))`,
      minScore: sql<number>`cast(min(${votes.points}) as decimal(10,2))`,
    }).from(votes).where(eq(votes.userID, userId)),

    db.select({
      categoryId: categories.id,
      categoryName: categories.name,
      avgScore: sql<number>`cast(avg(${votes.points}) as decimal(10,2))`,
      voteCount: sql<number>`count(*)::int`,
      spread: sql<number>`cast(max(${votes.points}) - min(${votes.points}) as decimal(10,2))`,
    })
    .from(votes)
    .where(eq(votes.userID, userId))
    .leftJoin(categories, eq(categories.id, votes.categories))
    .groupBy(categories.id, categories.name),

    db.select({
      actId: acts.id,
      artist: acts.artist,
      title: acts.title,
      points: votes.points,
      categoryName: categories.name,
      countryImage: countries.imageURL,
    })
    .from(votes)
    .where(eq(votes.userID, userId))
    .leftJoin(acts, eq(acts.id, votes.actID))
    .leftJoin(countries, eq(countries.id, acts.countryID))
    .leftJoin(categories, eq(categories.id, votes.categories))
    .orderBy(desc(votes.points))
    .limit(3),

    db.select({
      actId: acts.id,
      artist: acts.artist,
      title: acts.title,
      points: votes.points,
      categoryName: categories.name,
      countryImage: countries.imageURL,
    })
    .from(votes)
    .where(eq(votes.userID, userId))
    .leftJoin(acts, eq(acts.id, votes.actID))
    .leftJoin(countries, eq(countries.id, acts.countryID))
    .leftJoin(categories, eq(categories.id, votes.categories))
    .orderBy(asc(votes.points))
    .limit(3),
  ]);

  return { overall: overall[0], byCat, topActs, bottomActs };
}

// Most controversial acts (highest stddev across voters) in a group (or globally)
export function getControversialActs(groupId: string | null, limit = 5) {
  const base = db.select({
    actId: acts.id,
    artist: acts.artist,
    title: acts.title,
    avgScore: sql<number>`cast(avg(${votes.points}) as decimal(10,2))`,
    stddev: sql<number>`cast(coalesce(stddev(${votes.points}), 0) as decimal(10,2))`,
    voterCount: sql<number>`count(distinct ${votes.userID})::int`,
    countryImage: countries.imageURL,
  })
  .from(votes)
  .leftJoin(acts, eq(acts.id, votes.actID))
  .leftJoin(countries, eq(countries.id, acts.countryID))
  .groupBy(acts.id, acts.artist, acts.title, countries.imageURL)
  .having(sql`count(distinct ${votes.userID}) > 1`)
  .orderBy(desc(sql`stddev(${votes.points})`))
  .limit(limit);

  if (groupId) {
    return base
      .where(eq(votes.userID, userInGroups.userId))
      .leftJoin(userInGroups, eq(userInGroups.groupId, groupId));
  }
  return base;
}

// Most agreed-upon acts (lowest stddev) in a group (or globally)
export function getAgreedActs(groupId: string | null, limit = 5) {
  const base = db.select({
    actId: acts.id,
    artist: acts.artist,
    title: acts.title,
    avgScore: sql<number>`cast(avg(${votes.points}) as decimal(10,2))`,
    stddev: sql<number>`cast(coalesce(stddev(${votes.points}), 0) as decimal(10,2))`,
    voterCount: sql<number>`count(distinct ${votes.userID})::int`,
    countryImage: countries.imageURL,
  })
  .from(votes)
  .leftJoin(acts, eq(acts.id, votes.actID))
  .leftJoin(countries, eq(countries.id, acts.countryID))
  .groupBy(acts.id, acts.artist, acts.title, countries.imageURL)
  .having(sql`count(distinct ${votes.userID}) > 1`)
  .orderBy(asc(sql`coalesce(stddev(${votes.points}), 0)`), desc(sql`avg(${votes.points})`))
  .limit(limit);

  if (groupId) {
    return base
      .where(eq(votes.userID, userInGroups.userId))
      .leftJoin(userInGroups, eq(userInGroups.groupId, groupId));
  }
  return base;
}

// Per-voter profile: avg score, total votes, stddev (spread of their own votes)
export function getVoterProfiles(groupId: string | null) {
  const base = db.select({
    userId: votes.userID,
    userName: users.name,
    userImage: users.image,
    avgScore: sql<number>`cast(avg(${votes.points}) as decimal(10,2))`,
    totalVotes: sql<number>`count(*)::int`,
    spread: sql<number>`cast(coalesce(stddev(${votes.points}), 0) as decimal(10,2))`,
  })
  .from(votes)
  .leftJoin(users, eq(users.id, votes.userID))
  .groupBy(votes.userID, users.name, users.image)
  .orderBy(desc(sql`avg(${votes.points})`));

  if (groupId) {
    return base
      .where(eq(votes.userID, userInGroups.userId))
      .leftJoin(userInGroups, eq(userInGroups.groupId, groupId));
  }
  return base;
}

// Pearson correlation of current user's votes vs every other user — higher = more alike
export type SimilarityPeer = {
  other_id: string;
  other_name: string | null;
  other_image: string | null;
  shared_votes: number;
  pearson: number;
};

async function _querySimilarity(
  userId: string,
  groupId: string | null,
  order: 'DESC' | 'ASC',
  limit: number,
): Promise<SimilarityPeer[]> {
  // Pearson = cov(X,Y) / (σX * σY)
  // cov(X,Y) = E[XY] - E[X]*E[Y]  (computed in one pass via AVG aggregates)
  // Requires >= 3 shared votes to produce a meaningful correlation.
  const groupFilter = groupId
    ? sql`AND EXISTS (
        SELECT 1 FROM user_group ug
        WHERE ug.user_id = v."userID" AND ug.group_id = ${groupId}::uuid
      )`
    : sql``;

  const orderSql = order === 'DESC' ? sql`DESC` : sql`ASC`;

  const result = await db.execute(sql`
    WITH pairs AS (
      SELECT
        v."userID"                                     AS other_id,
        u.name                                         AS other_name,
        u.image                                        AS other_image,
        COUNT(*)::int                                  AS shared_votes,
        AVG(mv.pts * CAST(v.points AS FLOAT))
          - AVG(mv.pts) * AVG(CAST(v.points AS FLOAT)) AS covariance,
        STDDEV_POP(mv.pts)                             AS std_mine,
        STDDEV_POP(CAST(v.points AS FLOAT))            AS std_theirs
      FROM vote v
      JOIN (
        SELECT "actID", "categoriesID", CAST(points AS FLOAT) AS pts
        FROM vote WHERE "userID" = ${userId}
      ) mv ON mv."actID" = v."actID" AND mv."categoriesID" = v."categoriesID"
      JOIN "user" u ON u.id = v."userID"
      WHERE v."userID" != ${userId}
      ${groupFilter}
      GROUP BY v."userID", u.name, u.image
      HAVING COUNT(*) >= 3
    )
    SELECT
      other_id,
      other_name,
      other_image,
      shared_votes,
      CAST(
        COALESCE(covariance / NULLIF(std_mine * std_theirs, 0), 0)
      AS DECIMAL(6,4)) AS pearson
    FROM pairs
    ORDER BY pearson ${orderSql}
    LIMIT ${limit}
  `);
  return result as unknown as SimilarityPeer[];
}

export async function getUserMostAlike(
  userId: string,
  groupId: string | null,
  limit = 3,
): Promise<SimilarityPeer[]> {
  return _querySimilarity(userId, groupId, 'DESC', limit);
}

export async function getUserMostDifferent(
  userId: string,
  groupId: string | null,
  limit = 3,
): Promise<SimilarityPeer[]> {
  return _querySimilarity(userId, groupId, 'ASC', limit);
}

// How much does each user deviate from the group consensus?
export async function getUserDeviationFromGroup(groupId: string | null): Promise<Array<{
  user_id: string;
  user_name: string | null;
  user_image: string | null;
  deviation: string;
  vote_count: string;
}>> {
  if (groupId) {
    const result = await db.execute(sql`
      WITH group_avgs AS (
        SELECT v."actID", v."categoriesID",
               AVG(CAST(v.points AS FLOAT)) AS avg_score
        FROM vote v
        JOIN user_group ug ON ug.user_id = v."userID" AND ug.group_id = ${groupId}::uuid
        GROUP BY v."actID", v."categoriesID"
      )
      SELECT
        u.id    AS user_id,
        u.name  AS user_name,
        u.image AS user_image,
        CAST(SQRT(AVG(POWER(CAST(v.points AS FLOAT) - ga.avg_score, 2))) AS DECIMAL(10,2)) AS deviation,
        COUNT(*)::int AS vote_count
      FROM vote v
      JOIN user_group ug ON ug.user_id = v."userID" AND ug.group_id = ${groupId}::uuid
      JOIN "user" u ON u.id = v."userID"
      JOIN group_avgs ga ON ga."actID" = v."actID" AND ga."categoriesID" = v."categoriesID"
      GROUP BY u.id, u.name, u.image
      ORDER BY deviation DESC
    `);
    return result as unknown as any[];
  }

  const result = await db.execute(sql`
    WITH global_avgs AS (
      SELECT v."actID", v."categoriesID",
             AVG(CAST(v.points AS FLOAT)) AS avg_score
      FROM vote v
      GROUP BY v."actID", v."categoriesID"
    )
    SELECT
      u.id    AS user_id,
      u.name  AS user_name,
      u.image AS user_image,
      CAST(SQRT(AVG(POWER(CAST(v.points AS FLOAT) - ga.avg_score, 2))) AS DECIMAL(10,2)) AS deviation,
      COUNT(*)::int AS vote_count
    FROM vote v
    JOIN "user" u ON u.id = v."userID"
    JOIN global_avgs ga ON ga."actID" = v."actID" AND ga."categoriesID" = v."categoriesID"
    GROUP BY u.id, u.name, u.image
    ORDER BY deviation DESC
  `);
  return result as unknown as any[];
}
