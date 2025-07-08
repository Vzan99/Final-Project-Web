"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { EmploymentType, LocationType } from "@/types/userprofile";
import { UserProfileData } from "@/types/userprofile";

type ExperienceFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type Experience = {
  id?: string;
  title: string;
  employmentType?: EmploymentType;
  companyName: string;
  currentlyWorking?: boolean;
  startDate: string;
  endDate?: string;
  location?: string;
  locationType?: LocationType;
  description?: string;
};

const emptyExperience: Experience = {
  title: "",
  companyName: "",
  employmentType: EmploymentType.FULL_TIME,
  currentlyWorking: false,
  startDate: "",
  endDate: "",
  location: "",
  locationType: LocationType.ON_SITE,
  description: "",
};

export default function ExperienceForm({
  initialData,
  onSuccess,
  onCancel,
}: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const experienceList = initialData?.profile?.experiences;
    if (experienceList && Array.isArray(experienceList)) {
      const formatted = experienceList.map((exp) => ({
        ...exp,
        startDate: exp.startDate?.slice(0, 10),
        endDate: exp.endDate?.slice(0, 10),
      }));
      setExperiences(formatted);
    } else {
      setExperiences([emptyExperience]);
    }
  }, [initialData]);

  const updateExperience = <K extends keyof Experience>(
    index: number,
    field: K,
    value: Experience[K]
  ) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const addExperience = () => setExperiences([...experiences, emptyExperience]);

  const removeExperience = (index: number) => {
    const updated = [...experiences];
    updated.splice(index, 1);
    setExperiences(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put("/profile/edit/experiences", { experiences });
      toast.success("Experiences updated!");
      onSuccess();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update experiences"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {experiences.map((exp, index) => (
        <div key={index} className="border p-4 rounded-md relative bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) =>
                  updateExperience(index, "title", e.target.value)
                }
                required
                className="mt-1 block w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                value={exp.companyName}
                onChange={(e) =>
                  updateExperience(index, "companyName", e.target.value)
                }
                required
                className="mt-1 block w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Type
              </label>
              <select
                value={exp.employmentType}
                onChange={(e) =>
                  updateExperience(
                    index,
                    "employmentType",
                    e.target.value as EmploymentType
                  )
                }
                className="mt-1 block w-full border rounded px-3 py-2"
              >
                {Object.values(EmploymentType).map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location Type
              </label>
              <select
                value={exp.locationType}
                onChange={(e) =>
                  updateExperience(
                    index,
                    "locationType",
                    e.target.value as LocationType
                  )
                }
                className="mt-1 block w-full border rounded px-3 py-2"
              >
                {Object.values(LocationType).map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) =>
                  updateExperience(index, "startDate", e.target.value)
                }
                required
                className="mt-1 block w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={exp.endDate || ""}
                onChange={(e) =>
                  updateExperience(index, "endDate", e.target.value)
                }
                disabled={exp.currentlyWorking}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={exp.currentlyWorking}
                onChange={(e) =>
                  updateExperience(index, "currentlyWorking", e.target.checked)
                }
              />
              <label className="text-sm text-gray-700">
                Currently working here
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={exp.location || ""}
                onChange={(e) =>
                  updateExperience(index, "location", e.target.value)
                }
                className="mt-1 block w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={exp.description || ""}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
              rows={3}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          {experiences.length > 1 && (
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={addExperience}
          className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
          disabled={loading}
        >
          + Add Experience
        </button>
        <div className="space-x-2">
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
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
