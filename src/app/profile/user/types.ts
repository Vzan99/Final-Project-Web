export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  TEMPORARY = "TEMPORARY",
  VOLUNTEER = "VOLUNTEER",
  OTHER = "OTHER",
}

export enum LocationType {
  REMOTE = "REMOTE",
  ON_SITE = "ON_SITE",
  HYBRID = "HYBRID",
}

export type Experience = {
  id?: string;
  title: string;
  companyName: string;
  employmentType?: EmploymentType;
  currentlyWorking?: boolean;
  startDate: string;
  endDate?: string;
  location?: string;
  locationType?: LocationType;
  description?: string;
};

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
    bannerUrl?: string | null;
    resumeUrl?: string | null;
    skills: string[];
    about: string | null;
    experiences?: Experience[];
  } | null;
  certificates?: any[];
};
