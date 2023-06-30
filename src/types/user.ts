export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  title?: string;
  company?: string;
  linkedInUrl?: string;
  intro?: string;
}

export type UserInfo = {
  name: string;
  title: string;
  location: string;
  profilePhoto: string;
  linkedInUrl: string;
};

export type UserSearchResult = User[] | UserInfo[] | User | UserInfo | null;
