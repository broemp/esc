-- Merge duplicate lowercase 'song' category into the canonical 'Song' entry.
-- Re-assign any votes and group links from the old ID to the stable Song ID,
-- then delete the duplicate. Safe to run if no duplicate exists.

DO $$
DECLARE
  old_id uuid;
  new_id uuid := '30000000-0000-0000-0000-000000000001';
BEGIN
  -- Find the lowercase duplicate (any name that lowercases to 'song' but isn't the canonical ID)
  SELECT id INTO old_id
  FROM "category"
  WHERE LOWER("name") = 'song' AND id != new_id
  LIMIT 1;

  IF old_id IS NULL THEN
    RETURN; -- nothing to do
  END IF;

  -- Move votes: re-key the primary key (userID, actID, categoriesID)
  -- Insert with new category ID, skip if the user already has a vote under 'Song'
  INSERT INTO "vote" ("userID", "actID", "categoriesID", "points", "created_at")
  SELECT "userID", "actID", new_id, "points", "created_at"
  FROM "vote"
  WHERE "categoriesID" = old_id
  ON CONFLICT DO NOTHING;

  DELETE FROM "vote" WHERE "categoriesID" = old_id;

  -- Move category_group links
  INSERT INTO "category_group" ("categories_id", "group_id")
  SELECT new_id, "group_id"
  FROM "category_group"
  WHERE "categories_id" = old_id
  ON CONFLICT DO NOTHING;

  DELETE FROM "category_group" WHERE "categories_id" = old_id;

  -- Delete the duplicate category
  DELETE FROM "category" WHERE id = old_id;
END $$;
