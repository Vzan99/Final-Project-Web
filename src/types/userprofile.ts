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
  phone?: string;
  role: "USER" | "ADMIN" | "DEVELOPER";
  isVerified: boolean;
  subscription?: {
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    type: "STANDARD" | "PROFESSIONAL";
    startDate: string;
    endDate: string;
  };
  profile?: {
    photoUrl?: string | null;
    bannerUrl?: string | null;
    skills?: string[];
    education?: string | null;
    about?: string | null;
    address?: string | null;
    resumeUrl?: string | null;
    gender?: string | null;
    birthDate?: string | null;
    experiences?: Experience[] | null;
  } | null;
  company?: any;
  certificates?: {
    id: string;
    certificateUrl: string;
    verificationCode: string;
    issuedAt: string;
    expiresAt?: string;
  }[];
  assessments?: {
    id: string;
    badge: string;
    assessment: {
      name: string;
    };
  }[];
};
