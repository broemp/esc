import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  boolean,
  smallint,
  time,
  varchar,
  numeric
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';

export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
  groups: many(userInGroups)
}));

export const groups = pgTable('group', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  admin: text('adminID')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  public: boolean("public").notNull().default(false)
});

export const groupsRelations = relations(groups, ({ many }) => ({
  users: many(userInGroups),
  categories: many(categoriesInGroup)
}));

export const userInGroups = pgTable(
  'user_group',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id)
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.groupId] })
    };
  }
);

export const categories = pgTable('category', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  default: boolean("default").notNull().default(false),
  position: smallint("position"),
  description: text('description')
});

export const categoriesRelation = relations(categories, ({ many }) => ({
  group: many(categoriesInGroup)
}));

export const categoriesInGroup = pgTable(
  'category_group',
  {
    categoryId: uuid('categories_id')
      .notNull()
      .references(() => categories.id),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id)
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.categoryId, table.groupId] })
    };
  }
);

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] })
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
  })
);

export const acts = pgTable('act', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  countryID: uuid('country_id')
    .notNull()
    .references(() => countries.id, { onDelete: 'cascade' }),
  artist: text('artist').notNull(),
  title: text('title').notNull(),
  year: smallint('year').notNull(),
  picture_url: text('picture_url'),
  position: integer('position'),
  endpoints: integer('endpoints'),
  eliminated: boolean('eliminated').default(false)
});

export const countries = pgTable('country', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: varchar('code', { length: 4 }).notNull(),
  imageURL: text('imageURL')
});

export const drinks = pgTable('drink', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: text('name').notNull(),
  year: smallint('year').notNull(),
  alcohol: boolean('alcohol').notNull(),
  percentage: integer('percentage').default(0),
  countryID: uuid('country_id')
    .notNull()
    .references(() => countries.id, { onDelete: 'cascade' })
});

export const votes = pgTable('vote', {
  userID: text('userID')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  actID: uuid('actID')
    .notNull()
    .references(() => acts.id, { onDelete: 'cascade' }),
  categories: uuid('categoriesID')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  points: numeric('points', { precision: 3, scale: 1 }).notNull(),
  created_at: time('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    pk: primaryKey({
      columns: [table.userID, table.actID, table.categories]
    }),
    pkWithCustomName: primaryKey({ name: 'vote_pk', columns: [table.userID, table.actID, table.categories] })
  };
});
