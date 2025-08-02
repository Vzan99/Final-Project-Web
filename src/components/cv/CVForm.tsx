"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { cvSchema } from "@/schemas/cvSchema";

type Props = {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onServerDownload: (values: any) => void;
};

export default function CVForm({ form, setForm, onServerDownload }: Props) {
  return (
    <Formik
      initialValues={form}
      enableReinitialize
      validationSchema={cvSchema}
      onSubmit={(values) => {
        setForm(values);
        onServerDownload(values);
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form className="space-y-4">
          <Input label="Full Name" name="name" />
          <Input label="Email" name="email" type="email" />
          <Input label="Phone" name="phone" />
          <Textarea label="About" name="about" />
          <Textarea label="Work Experience" name="experience" />
          <Textarea label="Education" name="education" />
          <Textarea label="Skills (comma separated)" name="skills" />

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full bg-[#497187] text-white py-2 rounded-xl hover:bg-[#3b5c6a] transition disabled:opacity-50"
          >
            {isSubmitting ? "Generating..." : "Download CV"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

function Input({ label, name, ...props }: any) {
  return (
    <div>
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <Field
        name={name}
        {...props}
        className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#497187]"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
}

function Textarea({ label, name }: any) {
  return (
    <div>
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <Field
        as="textarea"
        name={name}
        rows={3}
        className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#497187]"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
}
