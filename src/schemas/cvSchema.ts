import * as Yup from "yup";

export const cvSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  summary: Yup.string().required("Summary is required"),
  experience: Yup.string().required("Experience is required"),
  education: Yup.string().required("Education is required"),
  skills: Yup.string().required("Skills are required"),
});
