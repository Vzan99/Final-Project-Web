import * as Yup from "yup";

export const applyJobSchema = Yup.object({
  expectedSalary: Yup.string()
    .matches(/^\d+$/, "Salary must be a number")
    .required("Expected salary is required")
    .max(9, "Salary must be at most 9 digits"),
  coverLetter: Yup.string().max(
    500,
    "Cover letter must be at most 500 characters"
  ),
  resume: Yup.mixed()
    .required("Resume is required")
    .test("fileSize", "Resume must be less than 1MB", (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return value.size <= 1024 * 1024;
      }
      return false;
    })
    .test("fileType", "You can only upload pdf and ms word file", (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(value.type);
      }
      return false;
    }),
});
