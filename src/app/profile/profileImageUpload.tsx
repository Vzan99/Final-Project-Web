"use client";

import { useRef, useState } from "react";
import { Pencil } from "lucide-react";

export default function ProfileImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="text-center space-y-4">
      <div className="relative w-32 h-32 mx-auto">
        <img
          src={image || "/default-avatar.png"}
          alt="Profile"
          className="rounded-full object-cover w-full h-full border border-[#B3C8CF]"
        />
        <button
          type="button"
          className="absolute bottom-0 right-0 bg-[#89A8B2] text-white rounded-full p-1 hover:bg-[#7a98a1]"
          onClick={() => fileRef.current?.click()}
        >
          <Pencil size={16} />
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileRef}
          hidden
        />
      </div>
    </div>
  );
}
