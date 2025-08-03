export type CompanyAdmin = {
  id: string;
  name: string;
};

export type CompanyInfo = {
  id: string;
  name: string;
  logo?: string | null;
  bannerUrl?: string | null;
  admin?: CompanyAdmin | null;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: string;
  employmentType: string;
  jobCategory: string;
  deadline: string;
  experienceLevel: string;
  isRemote: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  hasTest: boolean;
  companyId: string;
  isExpired?: boolean;
  isClosed?: boolean;
  company?: {
    id: string;
    logo?: string;
    bannerUrl?: string;
    description?: string;
    admin?: {
      name: string;
    };
  };
};
