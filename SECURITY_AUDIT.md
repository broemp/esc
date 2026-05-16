# Security Audit Report

**Date:** 2026-05-16  
**Scope:** Full source audit of the ESC SvelteKit application  
**Stack:** SvelteKit, Drizzle ORM, PostgreSQL, Auth.js

---

## HIGH — Unvalidated Points in Vote Form Action

**File:** `src/routes/vote/[id]/+page.server.ts:44-56`

The `vote` form action passes `points` from form data directly to the database without validation. The database column (`numeric(3,1)`) enforces the range -99.9 to 99.9, so a user can submit votes like `-99.9` or `50`, which are outside the intended 0–10 range and will skew group rankings.

The REST endpoint (`src/routes/vote/[id]/+server.ts`) correctly validates `0 ≤ points ≤ 10` in 0.5-point increments, but the form action bypasses this entirely.

**Fix:** Apply the same validation to the form action.

---

## HIGH — Any Authenticated User Can Create Global Categories

**Files:** `src/routes/group/new/+page.server.ts:38-43`, `src/routes/group/[id]/settings/categories/+server.ts:54-56`

`addCategorieToGroup(name, groupId)` looks up a category by name and **creates a new global category** if none is found. Both call-sites pass user-controlled strings to this function without restricting them to existing categories:

- **Group creation** (`/group/new`): any authenticated user can submit form field names outside `name`/`description`/`public`, and they become new categories.
- **Group settings** (`/group/[id]/settings/categories`): a group admin can POST an arbitrary array of strings; each unknown string becomes a new global category.

Global categories affect all groups and the entire voting system.

**Fix:** Validate that submitted category identifiers correspond to existing records before calling `addCategorieToGroup`, and never auto-create categories from user input.

---

## HIGH — Role Assignment Accepts Arbitrary Strings

**File:** `src/routes/admin/users/[id]/+server.ts:26-30`

The `PATCH` handler extracts `role` from the request body and passes it unchanged to `updateUserRole()`. The `users.role` column is untyped `text`, so an admin can set a user's role to any string. If any authorization logic uses string comparison against `role`, unexpected values could produce incorrect access decisions.

```typescript
const { role } = await request.json();
await updateUserRole(params.id, role); // no allowlist check
```

**Fix:** Validate `role` against an explicit allowlist (e.g., `['user', 'admin', 'deleted']`) before updating.

---

## MEDIUM — Client-Readable `is_admin` Cookie

**File:** `src/hooks.server.ts:72-80`

The `is_admin` cookie is set with `httpOnly: false`, making it readable (and writable) by JavaScript. The layout reads this cookie to decide whether to show the Admin nav link. While actual authorization is enforced server-side, this design:

1. Sends a false trust signal — any UI code that mistakenly gates behavior on this cookie can be bypassed by a user setting `document.cookie = 'is_admin=true'`.
2. Sets a precedent that risks future misuse.

**Fix:** Either use a `httpOnly: true` cookie (read server-side and injected into page data) or derive admin state purely from `session.user.role` already available in `$page.data.session`.

---

## MEDIUM — Public User Profiles Expose Full Vote History Without Authentication

**File:** `src/routes/user/[id]/+page.server.ts`

The `/user/[id]` route loads and returns all of a user's votes and public groups with no authentication check. Any unauthenticated visitor who knows or can guess a user ID can view their complete voting history.

**Fix:** Either require authentication, or explicitly design the endpoint as public and document that decision. If public profiles are intentional, consider whether exposing individual vote breakdowns is acceptable.

---

## MEDIUM — `trustHost: true` Without Documented Proxy Constraint

**File:** `src/hooks.server.ts:65`

`trustHost: true` tells Auth.js to trust the `Host` / `X-Forwarded-Host` headers from the incoming request. If the app is ever exposed directly (not behind a trusted reverse proxy), an attacker can set these headers to manipulate redirect URLs generated during OAuth flows, potentially enabling open-redirect or token-fixation attacks.

**Fix:** Keep `trustHost: true` only when the app is strictly behind a trusted proxy. Document this requirement, or use Auth.js's `url` option to pin the canonical origin instead.

---

## LOW — Internal Error Detail Exposed to Users

**Files:** `src/routes/admin/acts/new/+page.server.ts:42,47`, `src/routes/admin/drinks/new/+page.server.ts:38,44`

Validation and database exceptions are interpolated into client-visible failure messages:

```typescript
return fail(400, { message: 'Invalid Data, ' + e });
return fail(500, { message: 'Could not create database entry, ' + e });
```

These can expose stack traces, table names, or constraint names that aid an attacker's reconnaissance.

**Fix:** Log the full error server-side; return only a generic message to the client.

---

## LOW — No Rate Limiting

There is no rate limiting on any endpoint. Notable absence:

- `/vote/[id]` — votes are deduplicated by DB unique key, but rapid fire from many acts is unconstrained.
- `/group/join/[id]` — users can join arbitrarily many groups without throttling.
- Auth endpoints — brute-force of passkey or session tokens is not throttled at the app layer.

**Fix:** Add rate limiting at the reverse proxy or middleware layer for sensitive endpoints.

---

## Summary Table

| Severity | Finding |
|---|---|
| HIGH | Vote form action accepts out-of-range points |
| HIGH | Any user can create global categories via group creation |
| HIGH | Role assignment allows arbitrary string values |
| MEDIUM | `is_admin` cookie is client-readable and writable |
| MEDIUM | User vote history publicly accessible without authentication |
| MEDIUM | `trustHost: true` without enforced proxy requirement |
| LOW | Internal errors exposed in admin form responses |
| LOW | No rate limiting on votes, joins, or auth endpoints |
