import * as Yup from "yup";

export const profileSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  address: Yup.string()
    .max(100, "Address cannot exceed 100 characters")
    .required("Address is required"),
  about: Yup.string()
    .max(500, "About Me cannot exceed 500 characters")
    .required("About Me is required"),
});
