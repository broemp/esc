import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { acts, categories, countries, drinks, groups, users, userInGroups, votes } from './server/db/schema';

// Base types from schema
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

export type Act = InferSelectModel<typeof acts>;
export type NewAct = InferInsertModel<typeof acts>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Country = InferSelectModel<typeof countries>;
export type NewCountry = InferInsertModel<typeof countries>;

export type Drink = InferSelectModel<typeof drinks>;
export type NewDrink = InferInsertModel<typeof drinks>;

export type Vote = InferSelectModel<typeof votes>;
export type NewVote = InferInsertModel<typeof votes>;

export type UserInGroup = InferSelectModel<typeof userInGroups>;
export type NewUserInGroup = InferInsertModel<typeof userInGroups>;

// Extended types for API responses
export interface UserWithRole extends User {
  role: string;
}

export interface ActWithCountry extends Act {
  country: Country;
}

export interface GroupWithMembers extends Group {
  members: User[];
  categories: Category[];
}

export interface VoteWithAct extends Vote {
  act: Act;
  country: Country;
}

export interface CategoryWithVotes extends Category {
  votes: Vote[];
}

// Validation schemas
export interface UpdateUsername {
  username: string;
  userID: string;
}

// API response types
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
}; 