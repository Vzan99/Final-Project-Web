import * as Yup from "yup";

export const rejectionFeedbackSchema = Yup.object({
  feedback: Yup.string()
    .trim()
    .required("Feedback cannot be empty")
    .max(200, "Feedback must be under 200 characters"),
});
