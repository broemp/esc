UPDATE "user"
SET name = split_part(email, '@', 1)
WHERE name IS NULL;
