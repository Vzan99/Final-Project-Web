import * as Yup from "yup";

export const basicInfoSchema = Yup.object({
  gender: Yup.string()
    .oneOf(["MALE", "FEMALE", "OTHER", ""], "Invalid gender selection")
    .required("Gender is required"),
  birthDate: Yup.string()
    .required("Birth date is required")
    .test("birthDate", "Birth date cannot be in the future", (value) => {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }),
});
