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
    <div className="border border-gray-300 p-4 rounded-lg shadow-sm mb-6 bg-white">
      <label className="font-semibold block mb-2 text-[#1a1a1a]">
        Questions {index + 1}
      </label>
      <textarea
        {...formik.getFieldProps(`questions[${index}].question`)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#6096B4]"
        placeholder="question..."
      />
      {touched.question && error.question && (
        <p className="text-red-500 text-sm mt-1">{error.question}</p>
      )}

      <div className="grid grid-cols-1 gap-3 mt-4">
        {[0, 1, 2, 3].map((optIdx) => (
          <div key={optIdx}>
            <label className="flex items-center gap-3">
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
                className="accent-[#6096B4]"
              />
              <input
                type="text"
                {...formik.getFieldProps(
                  `questions[${index}].options[${optIdx}]`
                )}
                className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#6096B4]"
                placeholder={`Opsi ${String.fromCharCode(65 + optIdx)}`}
              />
            </label>
            {touched.options?.[optIdx] && error.options?.[optIdx] && (
              <p className="text-red-500 text-sm mt-1">
                {error.options[optIdx]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
