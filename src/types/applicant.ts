export interface Applicant {
  id: string;
  status: string;
  expectedSalary: number;
  cvFile: string;
  coverLetter?: string;
  appliedAt: string;

  user: {
    id: string;
    name: string;
    email: string;
    profile?: {
      photoUrl?: string | null;
      birthDate?: string | null;
      gender?: string;
      address?: string;
      education?: string;
      skills?: string[];
    };
  };

  job: {
    id: string;
    title: string;
  };

  test?: {
    score?: number;
    passed?: boolean;
    submittedAt?: string;
  };

  subscriptionType?: string;
  interviewStatus?: string;

  feedback?: string;
}
