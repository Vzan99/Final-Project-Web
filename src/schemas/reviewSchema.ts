import * as Yup from "yup";

export const ReviewSchema = Yup.object().shape({
  position: Yup.string().min(2).required("Position is required"),
  salaryEstimate: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be positive")
    .required("Salary is required"),
  content: Yup.string().min(10).required("Review is required"),
  rating: Yup.number().min(1).max(5).required(),
  cultureRating: Yup.number().min(1).max(5).required(),
  workLifeRating: Yup.number().min(1).max(5).required(),
  careerRating: Yup.number().min(1).max(5).required(),
  isAnonymous: Yup.boolean(),
});
