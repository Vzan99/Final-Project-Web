import { Formik, Form, Field, ErrorMessage } from "formik";
import { companyProfileSchema } from "@/schemas/profile/admin/companyProfileSchema";
import RichTextEditor from "../editor/richTextEditor";

type CompanyFormProps = {
  formData: {
    companyName: string;
    description: string;
    location: string;
    website: string;
    industry: string;
    foundedYear: string;
  };
  onChange: (e: { target: { name: string; value: string } }) => void;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
};

export default function CompanyForm({
  formData,
  onChange,
  onCancel,
  onSubmit,
  loading = false,
}: CompanyFormProps) {
  return (
    <Formik
      initialValues={formData}
      validationSchema={companyProfileSchema}
      onSubmit={(values) => onSubmit(values)}
      enableReinitialize
    >
      {({ setFieldValue, values, isSubmitting }) => (
        <Form>
          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block font-medium text-gray-700"
            >
              Company Name
            </label>
            <Field
              name="companyName"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="e.g. OpenAI Pty Ltd"
            />
            <ErrorMessage
              name="companyName"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block font-medium text-gray-700"
            >
              Description
            </label>
            <RichTextEditor
              value={values.description}
              onChange={(content) => {
                setFieldValue("description", content);
                onChange({ target: { name: "description", value: content } });
              }}
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block font-medium text-gray-700"
            >
              Location
            </label>
            <Field
              name="location"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="e.g. Melbourne, VIC"
            />
            <ErrorMessage
              name="location"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="block font-medium text-gray-700"
            >
              Website
            </label>
            <Field
              name="website"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="https://example.com"
            />
            <ErrorMessage
              name="website"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Industry */}
          <div>
            <label
              htmlFor="industry"
              className="block font-medium text-gray-700"
            >
              Industry
            </label>
            <Field
              name="industry"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="e.g. Technology"
            />
            <ErrorMessage
              name="industry"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Founded Year */}
          <div>
            <label
              htmlFor="foundedYear"
              className="block font-medium text-gray-700"
            >
              Founded Year
            </label>
            <Field
              name="foundedYear"
              type="number"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="e.g. 2005"
            />
            <ErrorMessage
              name="foundedYear"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#89A8B2] text-white hover:bg-[#7a98a1] disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
