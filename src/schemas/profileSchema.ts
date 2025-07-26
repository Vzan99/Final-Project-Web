// import * as Yup from "yup";

// export const profileSchema = Yup.object({
//   name: Yup.string()
//     .required("Name is required")
//     .min(2, "Name must be at least 2 characters"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   phone: Yup.string()
//     .matches(/^[0-9+()\-\s]*$/, "Invalid phone number")
//     .required("Phone number is required"),
//   address: Yup.string()
//     .required("Address is required")
//     .min(5, "Address must be at least 5 characters"),
//   about: Yup.string().max(500, "About section is too long"),
//   birthDate: Yup.date().nullable().typeError("Invalid date format"),
//   gender: Yup.string().oneOf(
//     ["Male", "Female", "Other", ""],
//     "Invalid gender selection"
//   ),
//   education: Yup.string().max(
//     100,
//     "Education must be less than 100 characters"
//   ),
//   skills: Yup.string().max(200, "Skills list is too long"),
// });
