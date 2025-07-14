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
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
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
    <form onSubmit={onSubmit}>
      {/* Company Name */}
      <div>
        <label
          htmlFor="companyName"
          className="block font-medium text-gray-700"
        >
          Company Name
        </label>
        <input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={onChange}
          className="mt-1 block w-full border rounded px-3 py-2"
          placeholder="e.g. OpenAI Pty Ltd"
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
          value={formData.description}
          onChange={(content) =>
            onChange({ target: { name: "description", value: content } })
          }
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block font-medium text-gray-700">
          Location
        </label>
        <input
          id="location"
          name="location"
          value={formData.location}
          onChange={onChange}
          className="mt-1 block w-full border rounded px-3 py-2"
          placeholder="e.g. Melbourne, VIC"
        />
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block font-medium text-gray-700">
          Website
        </label>
        <input
          id="website"
          name="website"
          value={formData.website}
          onChange={onChange}
          className="mt-1 block w-full border rounded px-3 py-2"
          placeholder="https://example.com"
        />
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="block font-medium text-gray-700">
          Industry
        </label>
        <input
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={onChange}
          className="mt-1 block w-full border rounded px-3 py-2"
          placeholder="e.g. Technology"
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
        <input
          id="foundedYear"
          type="number"
          name="foundedYear"
          value={formData.foundedYear}
          onChange={onChange}
          min={1800}
          max={new Date().getFullYear()}
          className="mt-1 block w-full border rounded px-3 py-2"
          placeholder="e.g. 2005"
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
          className="px-4 py-2 rounded bg-[#89A8B2] text-white hover:bg-[#7a98a1]"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
