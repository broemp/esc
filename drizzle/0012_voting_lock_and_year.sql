-- Voting lock and active year settings
INSERT INTO "setting" ("key", "value") VALUES ('votingLocked', 'false') ON CONFLICT DO NOTHING;
INSERT INTO "setting" ("key", "value") VALUES ('activeYear', '2026') ON CONFLICT DO NOTHING;
