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

  const handleUpdateStatus = async (
    id: string,
    status: "COMPLETED" | "CANCELLED"
  ) => {
    if (
      !confirm(`Yakin ingin mengubah status interview ini menjadi ${status}?`)
    )
      return;
    try {
      setLoadingId(id);
      await API.patch(`/interviews/${id}/status`, { status });
      toast.success(`Status berhasil diubah menjadi ${status}`);
      onUpdated();
    } catch {
      toast.error("Gagal mengubah status interview.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg shadow bg-white">
      <table className="w-full table-auto">
        <thead className="bg-[#6096B4] text-white">
          <tr>
            <th className="px-5 py-3 text-left text-sm font-semibold">
              Pelamar
            </th>
            <th className="px-5 py-3 text-left text-sm font-semibold">Job</th>
            <th className="px-5 py-3 text-left text-sm font-semibold">
              Tanggal
            </th>
            <th className="px-5 py-3 text-left text-sm font-semibold">
              Lokasi
            </th>
            <th className="px-5 py-3 text-left text-sm font-semibold">
              Status
            </th>
            <th className="px-5 py-3 text-left text-sm font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-6 text-gray-500 text-sm"
              >
                Belum ada jadwal interview.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="font-semibold text-gray-800">
                    {item.user.name}
                  </div>
                  <div className="text-sm text-gray-600">{item.user.email}</div>
                </td>
                <td className="px-5 py-3 text-gray-700 font-medium">
                  {item.job.title}
                </td>
                <td className="px-5 py-3 text-gray-700">
                  {new Date(item.dateTime).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-5 py-3 text-gray-700">
                  {item.location || "-"}
                </td>
                <td className="px-5 py-3">
                  <span className="uppercase text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3 space-x-2">
                  {!["COMPLETED", "CANCELLED"].includes(item.status) && (
                    <button
                      onClick={() => setSelectedInterview(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-5 py-2 rounded-lg font-medium transition"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={loadingId === item.id}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    Hapus
                  </button>
                  {!["COMPLETED", "CANCELLED"].includes(item.status) && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(item.id, "COMPLETED")}
                        disabled={loadingId === item.id}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                      >
                        Tandai Selesai
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, "CANCELLED")}
                        disabled={loadingId === item.id}
                        className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                      >
                        Batalkan
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
