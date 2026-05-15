ALTER TABLE "group" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
-- System user as owner of default groups (never signs in)
INSERT INTO "user" ("id", "email", "role", "created_at")
VALUES ('00000000-0000-0000-0000-000000000000', 'system@esc.local', 'admin', NOW())
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
-- Ensure Song category exists with a stable ID
INSERT INTO "category" ("id", "name", "default", "position", "description")
VALUES ('30000000-0000-0000-0000-000000000001', 'Song', true, 1, 'Quality of the song itself — melody, lyrics, and composition')
ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint
-- Create the Everybody default group
INSERT INTO "group" ("id", "adminID", "name", "public", "is_default")
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Everybody', true, true)
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
-- Link Song category to Everybody group
INSERT INTO "category_group" ("categories_id", "group_id")
SELECT "id", '00000000-0000-0000-0000-000000000001'
FROM "category"
WHERE "name" = 'Song'
ON CONFLICT DO NOTHING;
--> statement-breakpoint
-- Backfill all existing real users into Everybody group
INSERT INTO "user_group" ("user_id", "group_id")
SELECT "id", '00000000-0000-0000-0000-000000000001'
FROM "user"
WHERE "id" != '00000000-0000-0000-0000-000000000000'
ON CONFLICT DO NOTHING;
