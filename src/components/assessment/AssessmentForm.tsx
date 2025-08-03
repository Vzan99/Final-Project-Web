"use client";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import API from "@/lib/axios";
import toast from "react-hot-toast";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

type Assessment = {
  id: string;
  name: string;
  description?: string;
  passingScore?: number;
  timeLimit?: number;
  questions: Question[];
};

type AssessmentFormProps = {
  onCreated?: () => void;
  editData?: Assessment | null;
  onFinishEdit?: () => void;
};

const AssessmentSchema = Yup.object().shape({
  name: Yup.string().min(3).required("Name is required"),
  description: Yup.string(),
  passingScore: Yup.number().min(0).max(100).required(),
  timeLimit: Yup.number().min(1).required(),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        options: Yup.array()
          .of(Yup.string().required("Option is required"))
          .min(2, "At least 2 options")
          .max(6, "Maximum 6 options"),
        answer: Yup.number()
          .typeError("Answer is required")
          .min(0, "Answer must be valid")
          .required("Answer is required"),
      })
    )
    .min(1, "At least one question is required"),
});

export default function AssessmentForm({
  onCreated,
  editData,
  onFinishEdit,
}: AssessmentFormProps) {
  const isEdit = !!editData;

  const initialValues: Assessment = editData || {
    id: "",
    name: "",
    description: "",
    passingScore: 75,
    timeLimit: 30,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: 0,
      },
    ],
  };

  const handleSubmit = async (values: Assessment) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        passingScore: values.passingScore,
        timeLimit: values.timeLimit,
        questions: values.questions,
      };

      if (isEdit && editData) {
        await API.put(`/assessments/${editData.id}`, payload);
        toast.success("Assessment updated!");
        onFinishEdit?.();
      } else {
        await API.post("/assessments", payload);
        toast.success("Assessment created!");
        onCreated?.();
      }
    } catch {
      toast.error("Failed to submit assessment.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Assessment" : "Create Assessment"}
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={AssessmentSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values }) => (
          <Form className="space-y-4">
            <div>
              <Field
                name="name"
                placeholder="Assessment Name"
                className="border p-2 w-full rounded"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Field
                name="description"
                as="textarea"
                placeholder="Description (optional)"
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <Field
                  name="passingScore"
                  type="number"
                  placeholder="Passing Score"
                  className="border p-2 rounded w-full"
                />
                <ErrorMessage
                  name="passingScore"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="w-full">
                <Field
                  name="timeLimit"
                  type="number"
                  placeholder="Time Limit (minutes)"
                  className="border p-2 rounded w-full"
                />
                <ErrorMessage
                  name="timeLimit"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <FieldArray name="questions">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.questions.map((q, i) => (
                    <div
                      key={i}
                      className="border p-4 rounded bg-gray-50 space-y-2"
                    >
                      <p className="text-sm font-semibold text-gray-600">
                        Question {i + 1}
                      </p>

                      <div>
                        <Field
                          name={`questions.${i}.question`}
                          placeholder="Question"
                          className="border p-2 w-full"
                        />
                        <ErrorMessage
                          name={`questions.${i}.question`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {q.options.map((_, j) => (
                        <div key={j}>
                          <Field
                            name={`questions.${i}.options.${j}`}
                            placeholder={`Option ${j + 1}`}
                            className="border p-2 w-full"
                          />
                          <ErrorMessage
                            name={`questions.${i}.options.${j}`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      ))}

                      <div>
                        <Field
                          as="select"
                          name={`questions.${i}.answer`}
                          className="border p-2 w-full"
                        >
                          {q.options.map((_, j) => (
                            <option key={j} value={j}>
                              Correct Answer: Option {j + 1}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {values.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(i)}
                          className="text-red-600 text-sm underline"
                        >
                          Remove Question
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      push({
                        question: "",
                        options: ["", "", "", ""],
                        answer: 0,
                      })
                    }
                    className="bg-gray-200 px-4 py-2 rounded"
                  >
                    Add Question
                  </button>
                </div>
              )}
            </FieldArray>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isEdit ? "Update Assessment" : "Submit Assessment"}
              </button>
              {isEdit && (
                <button
                  type="button"
                  onClick={onFinishEdit}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
