-- Canonicalize all categories:
--   1. Ensure all canonical categories exist with stable IDs
--   2. Merge hardcoded-form variants (vocals, outfit, etc.) into canonical entries
--      moving all votes and group links before deleting the duplicates

CREATE OR REPLACE PROCEDURE _merge_refs(old_cat uuid, canonical_cat uuid)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "vote" SET "categoriesID" = canonical_cat
    WHERE "categoriesID" = old_cat
      AND NOT EXISTS (
        SELECT 1 FROM "vote" v2
        WHERE v2."userID" = "vote"."userID"
          AND v2."actID" = "vote"."actID"
          AND v2."categoriesID" = canonical_cat
      );
  DELETE FROM "vote" WHERE "categoriesID" = old_cat;

  INSERT INTO "category_group" ("categories_id", "group_id")
    SELECT canonical_cat, "group_id"
    FROM "category_group" WHERE "categories_id" = old_cat
    ON CONFLICT DO NOTHING;
  DELETE FROM "category_group" WHERE "categories_id" = old_cat;

  DELETE FROM "category" WHERE "id" = old_cat;
END;
$$;

CREATE OR REPLACE PROCEDURE _ensure_canonical(
  p_id          uuid,
  p_name        text,
  p_default     boolean,
  p_position    smallint,
  p_description text
)
LANGUAGE plpgsql AS $$
DECLARE
  name_id uuid;
BEGIN
  SELECT id INTO name_id FROM "category" WHERE "name" = p_name LIMIT 1;

  IF name_id IS NOT NULL AND name_id != p_id THEN
    CALL _merge_refs(name_id, p_id);
    INSERT INTO "category" ("id", "name", "default", "position", "description")
    VALUES (p_id, p_name, p_default, p_position, p_description)
    ON CONFLICT ("id") DO UPDATE
      SET "name"        = EXCLUDED."name",
          "default"     = EXCLUDED."default",
          "position"    = EXCLUDED."position",
          "description" = EXCLUDED."description";
  ELSE
    INSERT INTO "category" ("id", "name", "default", "position", "description")
    VALUES (p_id, p_name, p_default, p_position, p_description)
    ON CONFLICT ("id") DO UPDATE
      SET "name"        = EXCLUDED."name",
          "default"     = EXCLUDED."default",
          "position"    = EXCLUDED."position",
          "description" = EXCLUDED."description";
  END IF;
END;
$$;

DO $$
DECLARE
  id_song        uuid := '30000000-0000-0000-0000-000000000001';
  id_performance uuid := '30000000-0000-0000-0000-000000000002';
  id_staging     uuid := '30000000-0000-0000-0000-000000000003';
  id_costume     uuid := '30000000-0000-0000-0000-000000000004';
  id_esc_vibes   uuid := '30000000-0000-0000-0000-000000000005';
  id_drink       uuid := '30000000-0000-0000-0000-000000000006';
  id_snack       uuid := '30000000-0000-0000-0000-000000000007';
  id_meme        uuid := '30000000-0000-0000-0000-000000000008';
  old_id         uuid;
BEGIN

  -- ── Step 1: Establish all canonical categories ──────────────────────────

  CALL _ensure_canonical(id_song,        'Song'::text,            true,  1::smallint, 'Quality of the song itself — melody, lyrics, and composition'::text);
  CALL _ensure_canonical(id_performance, 'Performance'::text,     true,  2::smallint, 'Stage presence, vocal delivery, and overall performance quality'::text);
  CALL _ensure_canonical(id_staging,     'Staging'::text,         true,  3::smallint, 'Set design, lighting, visual effects, and use of the stage'::text);
  CALL _ensure_canonical(id_costume,     'Costume'::text,         true,  4::smallint, 'Outfit design, styling, and how well it fits the act''s theme'::text);
  CALL _ensure_canonical(id_esc_vibes,   'Eurovision Vibes'::text, true, 5::smallint, 'How well the entry captures the spirit of Eurovision'::text);
  CALL _ensure_canonical(id_drink,       'Drink'::text,           false, 6::smallint, 'Rating for the paired drink'::text);
  CALL _ensure_canonical(id_snack,       'Snack'::text,           false, 7::smallint, 'Rating for the paired snack'::text);
  CALL _ensure_canonical(id_meme,        'Meme Potential'::text,  false, 8::smallint, 'How meme-worthy is this entry?'::text);

  -- ── Step 2: Merge old hardcoded-form names into canonical categories ─────

  -- 'vocals' → Performance
  SELECT id INTO old_id FROM "category"
    WHERE LOWER("name") = 'vocals' AND "id" != id_performance LIMIT 1;
  IF old_id IS NOT NULL THEN CALL _merge_refs(old_id, id_performance); END IF;

  -- 'choreography' → Staging
  SELECT id INTO old_id FROM "category"
    WHERE LOWER("name") = 'choreography' AND "id" != id_staging LIMIT 1;
  IF old_id IS NOT NULL THEN CALL _merge_refs(old_id, id_staging); END IF;

  -- 'stage_design' → Staging
  SELECT id INTO old_id FROM "category"
    WHERE LOWER("name") = 'stage_design' AND "id" != id_staging LIMIT 1;
  IF old_id IS NOT NULL THEN CALL _merge_refs(old_id, id_staging); END IF;

  -- 'outfit' → Costume
  SELECT id INTO old_id FROM "category"
    WHERE LOWER("name") = 'outfit' AND "id" != id_costume LIMIT 1;
  IF old_id IS NOT NULL THEN CALL _merge_refs(old_id, id_costume); END IF;

  -- 'drink' (lowercase) → Drink
  SELECT id INTO old_id FROM "category"
    WHERE "name" = 'drink' AND "id" != id_drink LIMIT 1;
  IF old_id IS NOT NULL THEN CALL _merge_refs(old_id, id_drink); END IF;

  -- 'snack' (lowercase) → Snack
  SELECT id INTO old_id FROM "category"
    WHERE "name" = 'snack' AND "id" != id_snack LIMIT 1;
  IF old_id IS NOT NULL THEN CALL _merge_refs(old_id, id_snack); END IF;

  -- 'meme_potential' → Meme Potential
  SELECT id INTO old_id FROM "category"
    WHERE "name" = 'meme_potential' AND "id" != id_meme LIMIT 1;
  IF old_id IS NOT NULL THEN CALL _merge_refs(old_id, id_meme); END IF;

END $$;

DROP PROCEDURE IF EXISTS _merge_refs(uuid, uuid);
DROP PROCEDURE IF EXISTS _ensure_canonical(uuid, text, boolean, smallint, text);
