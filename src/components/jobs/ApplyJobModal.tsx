"use client";

import React, { useMemo, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, FileText } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { applyJobSchema } from "@/schemas/jobs/applyJobSchema";

type Props = {
  jobId: string;
  open: boolean;
  onClose: () => void;
  setHasApplied: (value: boolean) => void;
};

function SalaryInput() {
  const [field, meta, helpers] = useField("expectedSalary");
  const [salaryInput, setSalaryInput] = useState(field.value || "");

  const salary = useMemo(
    () => salaryInput.replace(/[^\d]/g, ""),
    [salaryInput]
  );

  const formattedSalary = useMemo(
    () => salary.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    [salary]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setSalaryInput(raw);
    helpers.setValue(raw);
  };

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        value={formattedSalary}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded"
        placeholder="e.g. 50,000"
      />
      {meta.touched && meta.error && (
        <div className="text-red-600 text-sm mt-1">{meta.error}</div>
      )}
    </>
  );
}

export default function ApplyJobModal({
  jobId,
  open,
  onClose,
  setHasApplied,
}: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>

          <h2 className="mb-4 text-lg font-semibold">Apply for this Job</h2>

          <Formik
            initialValues={{
              expectedSalary: "",
              coverLetter: "",
              resume: null as File | null,
            }}
            validationSchema={applyJobSchema}
            onSubmit={async (values, { resetForm }) => {
              if (!values.resume) {
                toast.error("Please upload a resume.");
                return;
              }

              setLoading(true);
              try {
                const formData = new FormData();
                formData.append("expectedSalary", values.expectedSalary);
                formData.append("coverLetter", values.coverLetter);
                formData.append("resume", values.resume);

                await API.post(`/jobs/${jobId}/apply`, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                  withCredentials: true,
                });

                toast.success("Application submitted!");
                setHasApplied(true);
                resetForm();
                onClose();
              } catch (err: any) {
                console.error(err);
                toast.error(err.response?.data?.error || "Submission failed.");
              } finally {
                setLoading(false);
              }
            }}
            validateOnBlur={true}
            validateOnChange={false}
            validateOnMount={true}
          >
            {({ setFieldValue, isSubmitting, values }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expected Salary
                  </label>
                  <SalaryInput />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cover Letter (optional) maximum 500 characters
                  </label>
                  <Field
                    as="textarea"
                    name="coverLetter"
                    className="w-full px-3 py-2 border rounded"
                    rows={4}
                  />
                  <ErrorMessage
                    name="coverLetter"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Resume (pdf, word, docx, maximum 1 mb)
                  </label>
                  <div className="mt-2 flex flex-col space-y-2">
                    <input
                      id="resume-upload"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        setFieldValue(
                          "resume",
                          e.currentTarget.files?.[0] ?? null
                        );
                      }}
                    />

                    <label
                      htmlFor="resume-upload"
                      className="inline-block cursor-pointer rounded bg-[#F1F0E8] border border-black px-4 py-2 hover:bg-[#e0dfd8] transition"
                    >
                      Choose File
                    </label>

                    {values.resume && (
                      <div className="flex items-center space-x-3">
                        <FileText className="text-[#6096B4]" size={20} />
                        <span className="truncate max-w-xs">
                          {values.resume.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFieldValue("resume", null)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove selected file"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}

                    <ErrorMessage
                      name="resume"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="w-full px-4 py-2 font-medium text-white bg-[#6096B4] rounded hover:bg-[#517d98] disabled:opacity-50"
                >
                  {loading ? "Submitting…" : "Submit Application"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Dialog>
  );
}
