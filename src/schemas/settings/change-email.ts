import * as Yup from "yup";

export const changeEmailSchema = Yup.object({
  newEmail: Yup.string()
    .email("Invalid email address")
    .required("New email is required"),
  password: Yup.string().required("Password is required"),
});
