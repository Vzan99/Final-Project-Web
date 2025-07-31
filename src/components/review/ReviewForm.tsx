"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ReviewSchema } from "@/schemas/reviewSchema";

export default function ReviewForm({ companyId }: { companyId: string }) {
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        position: "",
        salaryEstimate: "",
        content: "",
        rating: 5,
        cultureRating: 3,
        workLifeRating: 3,
        careerRating: 3,
        isAnonymous: true,
      }}
      validationSchema={ReviewSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await API.post("/reviews", {
            ...values,
            salaryEstimate: Number(values.salaryEstimate),
            companyId,
          });
          alert("Review submitted!");
          resetForm();
          router.refresh();
        } catch {
          alert("Failed to submit review.");
        }
      }}
    >
      {() => (
        <Form className="space-y-4 mt-6">
          <Field
            name="position"
            placeholder="Posisi"
            className="border p-2 w-full"
          />
          <ErrorMessage
            name="position"
            component="div"
            className="text-red-500 text-sm"
          />

          <Field
            name="salaryEstimate"
            placeholder="Gaji (per bulan)"
            className="border p-2 w-full"
          />
          <ErrorMessage
            name="salaryEstimate"
            component="div"
            className="text-red-500 text-sm"
          />

          <Field
            name="content"
            as="textarea"
            placeholder="Isi review..."
            className="border p-2 w-full"
          />
          <ErrorMessage
            name="content"
            component="div"
            className="text-red-500 text-sm"
          />

          <div className="flex items-center gap-2">
            <label>Rating Umum:</label>
            <Field
              name="rating"
              type="number"
              min={1}
              max={5}
              className="border p-1 w-16"
            />
            <ErrorMessage
              name="rating"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Field
                name="cultureRating"
                type="number"
                placeholder="Culture"
                className="border p-2 w-full"
              />
              <ErrorMessage
                name="cultureRating"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <Field
                name="workLifeRating"
                type="number"
                placeholder="Work-Life"
                className="border p-2 w-full"
              />
              <ErrorMessage
                name="workLifeRating"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <Field
                name="careerRating"
                type="number"
                placeholder="Career"
                className="border p-2 w-full"
              />
              <ErrorMessage
                name="careerRating"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <Field type="checkbox" name="isAnonymous" />
            Kirim sebagai anonim
          </label>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Kirim Review
          </button>
        </Form>
      )}
    </Formik>
  );
}
