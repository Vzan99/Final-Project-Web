import * as Yup from "yup";

export const profileSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9+()\-\s]*$/, "Invalid phone number")
    .required("Phone number is required"),
  location: Yup.string().required("Location is required"),
  about: Yup.string().max(500, "About section is too long"),
});
