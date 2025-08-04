import * as yup from "yup";

export const preSelectionTestSchema = yup.object().shape({
  questions: yup
    .array()
    .of(
      yup.object().shape({
        question: yup.string().trim().required("Question must not be empty"),
        options: yup
          .array()
          .of(yup.string().trim().required("All options must be filled in"))
          .length(4, "HThere must be 4 answer options"),
        correctIndex: yup
          .number()
          .required("A correct answer must be selected")
          .min(0)
          .max(3),
      })
    )
    .length(25, "There must be 25 questions"),
});
