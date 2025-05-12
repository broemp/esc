import type { 
  Act, NewAct, 
  Category, NewCategory, 
  Country, NewCountry, 
  Drink, NewDrink, 
  Group, NewGroup, 
  User, 
  Vote as BaseVote, NewVote,
  UserInGroup, NewUserInGroup,
  UpdateUsername
} from '../../../types';

export type ActList = {
  id: string;
  artist: string;
  title: string;
  position: number;
  country: {
    id: string;
    name: string;
    imageURL: string;
  };
};

export type CountryList = {
  id: string;
  name: string;
  imageURL: string;
};

export type GroupInfo = {
  id: string;
  name: string;
  public: boolean;
  members: {
    username: string;
    userid: string;
  }[];
  categories: {
    id: string;
    name: string;
  }[];
};

export type RankingCategoryGroup = {
  actID: string | null;
  artist: string | null;
  title: string | null;
  countryImage: string | null;
  score: number;
}[];

export type UserCategories = {
  category: {
    id: string;
    name: string;
    description: string | null;
    default: boolean;
    position: number | null;
  };
  category_group: {
    categoryId: string;
    groupId: string;
  } | null;
  user_group: {
    groupId: string;
    userId: string;
  } | null;
}[];

export type AdjacentActs = {
  id: string;
  countryID: string;
  artist: string;
  title: string;
  year: number;
  picture_url: string | null;
  position: number | null;
  endpoints: number | null;
  eliminated: boolean | null;
}[];

export type DefaultCategories = {
  id: string;
  name: string;
}[];

export type VotesForActByUser = {
  created_at: string;
  userID: string;
  actID: string;
  categories: string;
  points: string;
}[];

export type UpdateAct = {
  id: string;
  countryID: string;
  artist: string;
  title: string;
  year: number;
  position: number;
  endpoints: number;
  picture_url: string | null;
  eliminated: boolean;
};

export type Vote = {
  userID: string;
  actID: string;
  categories: string;
  points: string;
  created_at?: string;
};

export type {
  Act, NewAct,
  Category, NewCategory,
  Country, NewCountry,
  Drink, NewDrink,
  Group, NewGroup,
  User,
  NewVote,
  UserInGroup, NewUserInGroup,
  UpdateUsername
}; 