export type UserProfileData = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  profile?: {
    birthDate: string | null;
    gender: string | null;
    education: string | null;
    address: string | null;
    photoUrl?: string | null;
    resumeUrl?: string | null;
    skills: string[];
    about: string | null;
  } | null;
  certificates?: any[];
};
