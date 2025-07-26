import * as Yup from "yup";

export const skillsSchema = Yup.object({
  skills: Yup.string()
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .required("Skills are required")
    .test(
      "is-valid-skill-list",
      "Each skill must be a non-empty string",
      (value) => {
        if (!value) return false;
        return value
          .split(",")
          .map((s) => s.trim())
          .every((s) => s.length > 0);
      }
    ),
});
