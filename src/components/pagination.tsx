"use client";

import React from "react";

type SortOption = "date" | "salaryAsc" | "salaryDesc" | "relevance";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const maxButtons = 7;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="mt-6 flex justify-center gap-1 flex-wrap">
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        First
      </button>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        Prev
      </button>

      {getPageNumbers().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded ${
            p === page ? "bg-[#6096B4] text-white" : "hover:bg-gray-200"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        className="px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        Last
      </button>
    </div>
  );
}
