CREATE TABLE IF NOT EXISTS "setting" (
  "key" text NOT NULL,
  "value" text NOT NULL,
  CONSTRAINT "setting_pkey" PRIMARY KEY ("key")
);

-- Default: stats enabled
INSERT INTO "setting" ("key", "value") VALUES ('statsEnabled', 'true') ON CONFLICT DO NOTHING;
