export type Application = {
  id: string;
  expectedSalary: number;
  status: "PENDING" | "REVIEWED" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    company: {
      admin?: {
        name: string;
      };
    };
  };
};
