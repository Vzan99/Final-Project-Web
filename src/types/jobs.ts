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
  experienceLevel: string;
  isRemote: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  hasTest: boolean;
  companyId: string;
  company?: {
    id: string;
    logo?: string;
    bannerUrl?: string;
    admin?: {
      name: string;
    };
  };
};
