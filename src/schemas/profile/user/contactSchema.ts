import * as Yup from "yup";

export const contactSchema = Yup.object({
  phone: Yup.string()
    .required("Phone number is required")
    .min(6, "Phone number must be at least 6 characters")
    .max(20, "Phone number cannot exceed 20 characters")
    .matches(/^[\d\s()+-]+$/, "Phone number format is invalid"),
});
