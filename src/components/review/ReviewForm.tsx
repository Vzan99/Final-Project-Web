"use client";

import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import StarRatings from "react-star-ratings";
import API from "@/lib/axios";
import { ReviewSchema } from "@/schemas/reviewSchema";
import { useAppSelector } from "@/lib/redux/hooks";

function StarRatingInput({ name, label }: { name: string; label: string }) {
  const { values, setFieldValue } = useFormikContext<any>();
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium">{label}</label>
      <StarRatings
        rating={values[name]}
        starRatedColor="orange"
        starHoverColor="orange"
        changeRating={(newRating: number) => setFieldValue(name, newRating)}
        numberOfStars={5}
        starDimension="24px"
        starSpacing="2px"
        name={name}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
}

export default function ReviewForm({
  companyId,
  onSubmitted,
}: {
  companyId: string;
  onSubmitted?: () => void;
}) {
  const { user } = useAppSelector((state) => state.auth);
  const isVerified = user?.isVerified;

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
          onSubmitted?.();
        } catch {
          alert("Failed to submit review.");
        }
      }}
    >
      {() => (
        <Form className="space-y-4 mt-6">
          <div>
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
          </div>

          <div>
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
          </div>

          <div>
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
          </div>

          <StarRatingInput name="rating" label="Rating Umum" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StarRatingInput name="cultureRating" label="Culture" />
            <StarRatingInput name="workLifeRating" label="Work-Life Balance" />
            <StarRatingInput name="careerRating" label="Career Opportunity" />
          </div>

          <label className="flex items-center gap-2">
            <Field type="checkbox" name="isAnonymous" />
            Kirim sebagai anonim
          </label>

          <button
            type="submit"
            className={`bg-indigo-600 text-white px-4 py-2 rounded ${
              !isVerified ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isVerified}
          >
            {isVerified ? "Kirim Review" : "Akun belum terverifikasi"}
          </button>

          {!isVerified && (
            <p className="text-sm text-red-600">
              Verifikasi akun terlebih dahulu untuk mengirim review.
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}
