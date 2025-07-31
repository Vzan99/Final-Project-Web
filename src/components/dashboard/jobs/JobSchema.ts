import * as Yup from "yup";

const jobCategories = [
  "FRONTEND_DEVELOPER",
  "BACKEND_DEVELOPER",
  "FULL_STACK_DEVELOPER",
  "MOBILE_APP_DEVELOPER",
  "DEVOPS_ENGINEER",
  "GAME_DEVELOPER",
  "SOFTWARE_ENGINEER",
  "DATA_ENGINEER",
  "SECURITY_ENGINEER",
  "OTHER",
];

const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
  "VOLUNTEER",
  "OTHER",
];

export const jobSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  location: Yup.string().trim().required("Location is required"),

  jobCategory: Yup.string()
    .oneOf(jobCategories, "Invalid category")
    .required("Category is required"),

  deadline: Yup.string()
    .required("Deadline is required")
    .test("is-date", "Invalid date", (value) => {
      return !isNaN(Date.parse(value ?? ""));
    }),

  salary: Yup.number()
    .typeError("Salary must be a number")
    .positive("Salary must be positive")
    .integer("Salary must be an integer")
    .nullable(),

  experienceLevel: Yup.string()
    .oneOf(["Entry", "Mid", "Senior"], "Invalid experience level")
    .required("Experience level is required"),

  employmentType: Yup.string()
    .oneOf(employmentTypes, "Invalid job type")
    .required("Job type is required"),

  isRemote: Yup.boolean().required(),
  hasTest: Yup.boolean().required(),

  tags: Yup.array()
    .of(
      Yup.string().transform((val) =>
        typeof val === "string" ? val.trim() : ""
      )
    )
    .nullable(),

  banner: Yup.mixed<File>()
    .nullable()
    .test("fileType", "Unsupported format", (value) => {
      if (!value) return true;
      return ["image/png", "image/jpeg", "image/webp"].includes(value.type);
    }),
});
