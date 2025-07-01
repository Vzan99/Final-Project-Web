"use client";

import { InterviewItem } from "@/app/dashboard/interviews/page";
import EditInterviewModal from "./EditInterviewModal";
import { useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";

interface Props {
  data: InterviewItem[];
  onUpdated: () => void;
}

export default function InterviewListTable({ data, onUpdated }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewItem | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus interview ini?")) return;
    try {
      setLoadingId(id);
      await API.delete(`/interviews/${id}`);
      toast.success("Interview berhasil dihapus.");
      onUpdated();
    } catch {
      toast.error("Gagal menghapus interview.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Pelamar</th>
            <th className="px-4 py-2">Job</th>
            <th className="px-4 py-2">Tanggal</th>
            <th className="px-4 py-2">Lokasi</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Belum ada jadwal interview.
              </td>
            </tr>
          )}
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">
                <div className="font-medium">{item.user.name}</div>
                <div className="text-sm text-gray-600">{item.user.email}</div>
              </td>
              <td className="px-4 py-2">{item.job.title}</td>
              <td className="px-4 py-2">
                {new Date(item.dateTime).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-2">{item.location || "-"}</td>
              <td className="px-4 py-2">
                <span className="uppercase text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => setSelectedInterview(item)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={loadingId === item.id}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Edit Interview */}
      {selectedInterview && (
        <EditInterviewModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onUpdated={() => {
            setSelectedInterview(null);
            onUpdated();
          }}
        />
      )}
    </div>
  );
}
