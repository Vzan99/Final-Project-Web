import * as Yup from "yup";

export const educationSchema = Yup.object({
  education: Yup.string()
    .required("Education is required")
    .min(2, "Education must be at least 2 characters")
    .max(100, "Education cannot exceed 100 characters"),
});
