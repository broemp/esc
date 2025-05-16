-- Add indexes for frequently joined columns
CREATE INDEX IF NOT EXISTS "idx_votes_userid" ON "votes" ("userID");
CREATE INDEX IF NOT EXISTS "idx_votes_actid" ON "votes" ("actID");
CREATE INDEX IF NOT EXISTS "idx_votes_categories" ON "votes" ("categories");
CREATE INDEX IF NOT EXISTS "idx_useringroups_groupid" ON "userInGroups" ("groupId");
CREATE INDEX IF NOT EXISTS "idx_useringroups_userid" ON "userInGroups" ("userId");
CREATE INDEX IF NOT EXISTS "idx_acts_countryid" ON "acts" ("countryID");

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "idx_votes_user_act" ON "votes" ("userID", "actID");
CREATE INDEX IF NOT EXISTS "idx_votes_user_category" ON "votes" ("userID", "categories");

-- Add indexes for frequently ordered columns
CREATE INDEX IF NOT EXISTS "idx_acts_position" ON "acts" ("position");
CREATE INDEX IF NOT EXISTS "idx_categories_position" ON "categories" ("position");

-- Add partial index for filtered queries
CREATE INDEX IF NOT EXISTS "idx_groups_public" ON "groups" ("id") WHERE "public" = true; 