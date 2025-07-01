import * as yup from "yup";

export const preSelectionAnswerSchema = yup.object().shape({
  answers: yup
    .array()
    .of(
      yup
        .number()
        .min(0, "Pilih jawaban")
        .max(3, "Pilih jawaban")
        .required("Jawaban wajib diisi")
    )
    .length(25, "Harus menjawab 25 soal"),
});
