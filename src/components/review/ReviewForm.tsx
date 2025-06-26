"use client";

import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    rating: 5,
    salaryEstimate: 0,
    position: "",
    content: "",
    isAnonymous: true,
    cultureRating: 0,
    workLifeRating: 0,
    careerRating: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/reviews", {
      ...form,
      companyId,
    });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold">Tulis Review</h3>

      <input
        name="position"
        placeholder="Posisi"
        value={form.position}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="number"
        name="salaryEstimate"
        placeholder="Gaji (per bulan)"
        value={form.salaryEstimate}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <textarea
        name="content"
        placeholder="Isi review..."
        value={form.content}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />

      <div className="flex items-center gap-2">
        <label>Rating Umum: </label>
        <input
          type="number"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          min={1}
          max={5}
          className="border p-1 w-16"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          name="cultureRating"
          value={form.cultureRating}
          onChange={handleChange}
          placeholder="Culture (1-5)"
          className="border p-2"
        />
        <input
          type="number"
          name="workLifeRating"
          value={form.workLifeRating}
          onChange={handleChange}
          placeholder="Work-Life (1-5)"
          className="border p-2"
        />
        <input
          type="number"
          name="careerRating"
          value={form.careerRating}
          onChange={handleChange}
          placeholder="Career (1-5)"
          className="border p-2"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isAnonymous"
          checked={form.isAnonymous}
          onChange={handleCheckbox}
        />
        Kirim sebagai anonim
      </label>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Kirim Review
      </button>
    </form>
  );
}
