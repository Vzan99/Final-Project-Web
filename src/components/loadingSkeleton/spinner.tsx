"use client";

import React from "react";

export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#EEE9DA]">
      <div className="w-24 h-24 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
