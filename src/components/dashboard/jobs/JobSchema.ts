import * as Yup from "yup";

export const jobSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  location: Yup.string().trim().required("Location is required"),
  category: Yup.string().trim().required("Category is required"),
  deadline: Yup.string().trim().required("Deadline is required"),
  salary: Yup.number().positive().nullable(),
  experienceLevel: Yup.string().oneOf(["Entry", "Mid", "Senior"]).required(),
  jobType: Yup.string()
    .oneOf(["Full-time", "Part-time", "Contract"])
    .required(),
  isRemote: Yup.boolean().required(),
  tags: Yup.array()
    .of(
      Yup.string().transform((val) =>
        typeof val === "string" ? val.trim() : ""
      )
    )
    .nullable(),
  hasTest: Yup.boolean().required(),
  banner: Yup.mixed<File>()
    .nullable()
    .test("fileType", "Unsupported format", (value) => {
      if (!value) return true;
      return ["image/png", "image/jpeg", "image/webp"].includes(value.type);
    }),
});
