import * as Yup from "yup";

export const companyProfileSchema = Yup.object().shape({
  companyName: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .required("Company name is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot be longer than 2000 characters"),
  location: Yup.string()
    .required("Location is required")
    .max(100, "Location cannot be longer than 100 characters"),
  website: Yup.string()
    .url("Enter a valid URL")
    .nullable()
    .notRequired()
    .test("is-empty-or-url", "Enter a valid URL", (value) => {
      return !value || Yup.string().url().isValidSync(value);
    }),
  industry: Yup.string()
    .required("Industry is required")
    .max(50, "Industry cannot be longer than 50 characters"),
  foundedYear: Yup.number()
    .typeError("Year must be a number")
    .min(1800, "Year must be after 1800")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .nullable()
    .required("Founded year is required"),
});
