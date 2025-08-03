"use client";

import { useEffect } from "react";
import { Formik, FieldArray, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import API from "@/lib/axios";
import { experienceSchema } from "@/schemas/profile/user/experienceSchema";
import { EmploymentType, LocationType } from "@/types/userprofile";
import { UserProfileData } from "@/types/userprofile";
import toFriendlyName from "@/utils/friendly";

type ExperienceFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ExperienceForm({
  initialData,
  onSuccess,
  onCancel,
}: ExperienceFormProps) {
  const initialExperiences = (initialData?.profile?.experiences || []).map(
    (exp) => ({
      ...exp,
      startDate: exp.startDate?.slice(0, 10),
      endDate: exp.endDate?.slice(0, 10),
    })
  );

  return (
    <Formik
      initialValues={{
        experiences:
          initialExperiences.length > 0
            ? initialExperiences
            : [
                {
                  title: "",
                  companyName: "",
                  employmentType: EmploymentType.FULL_TIME,
                  currentlyWorking: false,
                  startDate: "",
                  endDate: "",
                  location: "",
                  locationType: LocationType.ON_SITE,
                  description: "",
                },
              ],
      }}
      validationSchema={experienceSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await API.put("/profile/edit/experiences", values);
          toast.success("Experiences updated!");
          onSuccess();
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message || "Failed to update experiences"
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting, handleChange, setFieldValue }) => (
        <Form className="space-y-8">
          <FieldArray name="experiences">
            {({ remove, push }) => (
              <>
                {values.experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-md relative bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Job Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Job Title
                        </label>
                        <Field
                          name={`experiences.${index}.title`}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                        <ErrorMessage
                          name={`experiences.${index}.title`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <Field
                          name={`experiences.${index}.companyName`}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                        <ErrorMessage
                          name={`experiences.${index}.companyName`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Employment Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Employment Type
                        </label>
                        <Field
                          as="select"
                          name={`experiences.${index}.employmentType`}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        >
                          {Object.values(EmploymentType).map((type) => (
                            <option key={type} value={type}>
                              {toFriendlyName(type)}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Location Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Location Type
                        </label>
                        <Field
                          as="select"
                          name={`experiences.${index}.locationType`}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        >
                          {Object.values(LocationType).map((type) => (
                            <option key={type} value={type}>
                              {toFriendlyName(type)}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Start Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <Field
                          type="date"
                          name={`experiences.${index}.startDate`}
                          className="mt-1 block w-full border rounded px-3 py-2"
                          max={new Date().toISOString().split("T")[0]}
                        />
                        <ErrorMessage
                          name={`experiences.${index}.startDate`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <Field
                          type="date"
                          name={`experiences.${index}.endDate`}
                          className="mt-1 block w-full border rounded px-3 py-2"
                          disabled={values.experiences[index].currentlyWorking}
                          max={new Date().toISOString().split("T")[0]}
                        />
                        <ErrorMessage
                          name={`experiences.${index}.endDate`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Currently Working */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Field
                          type="checkbox"
                          name={`experiences.${index}.currentlyWorking`}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const checked = e.target.checked;
                            setFieldValue(
                              `experiences.${index}.currentlyWorking`,
                              checked
                            );
                            if (checked) {
                              setFieldValue(`experiences.${index}.endDate`, "");
                            }
                          }}
                        />
                        <label className="text-sm text-gray-700">
                          Currently working here
                        </label>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <Field
                          name={`experiences.${index}.location`}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                        <ErrorMessage
                          name={`experiences.${index}.location`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name={`experiences.${index}.description`}
                        rows={3}
                        className="mt-1 block w-full border rounded px-3 py-2"
                      />
                      <ErrorMessage
                        name={`experiences.${index}.description`}
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {values.experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    push({
                      title: "",
                      companyName: "",
                      employmentType: EmploymentType.FULL_TIME,
                      currentlyWorking: false,
                      startDate: "",
                      endDate: "",
                      location: "",
                      locationType: LocationType.ON_SITE,
                      description: "",
                    })
                  }
                  className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
                  disabled={isSubmitting}
                >
                  + Add Experience
                </button>
              </>
            )}
          </FieldArray>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#89A8B2] text-white hover:bg-[#7a98a1]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
