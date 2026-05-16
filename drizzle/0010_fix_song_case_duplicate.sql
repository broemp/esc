-- Merge any case-variant of 'song' (e.g. lowercase 'song') into the canonical 'Song' entry.
-- 0006 attempted this but the duplicate persists; this is the definitive fix.

DO $$
DECLARE
  canonical_id uuid := '30000000-0000-0000-0000-000000000001';
  old_id       uuid;
BEGIN
  SELECT id INTO old_id FROM "category"
    WHERE LOWER("name") = 'song' AND "id" != canonical_id
    LIMIT 1;

  IF old_id IS NULL THEN RETURN; END IF;

  -- Move votes that don't already have a Song vote for the same act/user
  UPDATE "vote" SET "categoriesID" = canonical_id
    WHERE "categoriesID" = old_id
      AND NOT EXISTS (
        SELECT 1 FROM "vote" v2
        WHERE v2."userID" = "vote"."userID"
          AND v2."actID"  = "vote"."actID"
          AND v2."categoriesID" = canonical_id
      );
  DELETE FROM "vote" WHERE "categoriesID" = old_id;

  -- Move group links
  INSERT INTO "category_group" ("categories_id", "group_id")
    SELECT canonical_id, "group_id"
    FROM "category_group" WHERE "categories_id" = old_id
    ON CONFLICT DO NOTHING;
  DELETE FROM "category_group" WHERE "categories_id" = old_id;

  DELETE FROM "category" WHERE "id" = old_id;
END $$;
