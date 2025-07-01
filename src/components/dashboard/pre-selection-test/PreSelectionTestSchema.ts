import * as yup from "yup";

export const preSelectionTestSchema = yup.object().shape({
  questions: yup
    .array()
    .of(
      yup.object().shape({
        question: yup.string().trim().required("Pertanyaan tidak boleh kosong"),
        options: yup
          .array()
          .of(yup.string().trim().required("Opsi harus diisi"))
          .length(4, "Harus ada 4 opsi jawaban"),
        correctIndex: yup
          .number()
          .required("Jawaban benar harus dipilih")
          .min(0)
          .max(3),
      })
    )
    .length(25, "Harus ada 25 pertanyaan"),
});
