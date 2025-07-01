import { FormikProps } from "formik";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Props {
  index: number;
  formik: FormikProps<{
    questions: Question[];
  }>;
}

export default function PreSelectionQuestionCard({ index, formik }: Props) {
  // Type-safe access with guards
  const rawError = formik.errors.questions?.[index];
  const rawTouched = formik.touched.questions?.[index];

  const error = (
    typeof rawError === "object" && rawError !== null
      ? (rawError as FormikProps<Question>)
      : {}
  ) as Partial<Question>;

  const touched = (
    typeof rawTouched === "object" && rawTouched !== null
      ? (rawTouched as FormikProps<Question>)
      : {}
  ) as Partial<Question>;

  return (
    <div className="border p-4 rounded-lg shadow mb-6">
      <label className="font-semibold block mb-1">Pertanyaan {index + 1}</label>
      <textarea
        {...formik.getFieldProps(`questions[${index}].question`)}
        className="w-full border px-3 py-2 rounded"
        placeholder="Tulis pertanyaan..."
      />
      {touched.question && error.question && (
        <div className="text-red-500 text-sm">{error.question}</div>
      )}

      <div className="grid grid-cols-1 gap-2 mt-4">
        {[0, 1, 2, 3].map((optIdx) => (
          <div key={optIdx}>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`questions[${index}].correctIndex`}
                value={optIdx}
                checked={formik.values.questions[index].correctIndex === optIdx}
                onChange={() =>
                  formik.setFieldValue(
                    `questions[${index}].correctIndex`,
                    optIdx
                  )
                }
              />
              <input
                type="text"
                {...formik.getFieldProps(
                  `questions[${index}].options[${optIdx}]`
                )}
                className="flex-1 border px-3 py-1 rounded"
                placeholder={`Opsi ${String.fromCharCode(65 + optIdx)}`}
              />
            </label>
            {touched.options?.[optIdx] && error.options?.[optIdx] && (
              <div className="text-red-500 text-sm">
                {error.options[optIdx]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
