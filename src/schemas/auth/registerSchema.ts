import * as Yup from "yup";

export const registerSchema = (role: "USER" | "ADMIN") =>
  Yup.object({
    name:
      role === "ADMIN"
        ? Yup.string()
            .min(2, "Company name is at least 2 letters")
            .required("Company name is required")
        : Yup.string().notRequired(),
    phone:
      role === "ADMIN"
        ? Yup.string()
            .min(6, "Phone number is too short")
            .max(20, "Phone number is too long")
            .matches(/^[\d\s()+-]+$/, "Phone number format is invalid")
            .required("Phone number is required")
        : Yup.string().notRequired(),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm Password is required"),
  });
