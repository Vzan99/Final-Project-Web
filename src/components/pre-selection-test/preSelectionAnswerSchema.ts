import * as yup from "yup";

export const preSelectionAnswerSchema = yup.object().shape({
  answers: yup
    .array()
    .of(
      yup
        .number()
        .min(0, "Select Answer")
        .max(3, "Select Answer")
        .required("Answer is required")
    )
    .length(25, "You must answer all 25 questions"),
});
