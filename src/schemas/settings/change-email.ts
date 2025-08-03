import * as Yup from "yup";

export const changeEmailSchema = (currentEmail: string) =>
  Yup.object({
    newEmail: Yup.string()
      .email("Invalid email address")
      .required("New email is required")
      .notOneOf(
        [currentEmail],
        "New email must be different from current email"
      ),
    password: Yup.string().required("Password is required"),
  });
