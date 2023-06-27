export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  title?: string;
  company?: string;
  linkedin?: string;
  intro?: string;
}

export type UserInfo = {
  name: string;
  title: string;
  location: string;
  profilePhoto: string;
  linkedInUrl: string;
};
