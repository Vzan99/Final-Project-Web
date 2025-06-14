export interface IAuthLogin {
  email: string;
  password: string;
}

export interface IAuthRegister {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  phone?: string;
}
