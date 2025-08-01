"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import { Share2 } from "lucide-react";
import { SiFacebook, SiLinkedin, SiX, SiWhatsapp } from "react-icons/si";

type Props = {
  url: string;
  title?: string;
  hashtag?: string;
};

export default function SocialShare({
  url,
  title = "Check this out!",
  hashtag = "#JobBoard",
}: Props) {
  const [open, setOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={shareRef}
      className="relative inline-block"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full transition bg-white hover:bg-gray-100 text-gray-600 hover:text-[#6096B4] flex items-center justify-center"
        title="Share Job"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 flex flex-col gap-3 bg-white border border-gray-200 shadow-lg rounded-md p-2">
          <FacebookShareButton url={url} hashtag={hashtag}>
            <SiFacebook className="w-5 h-5 text-blue-600 hover:scale-110 transition" />
          </FacebookShareButton>

          <LinkedinShareButton url={url} summary={title}>
            <SiLinkedin className="w-5 h-5 text-blue-700 hover:scale-110 transition" />
          </LinkedinShareButton>

          <TwitterShareButton url={url} title={title}>
            <SiX className="w-5 h-5 text-black hover:scale-110 transition" />
          </TwitterShareButton>

          <WhatsappShareButton url={url} title={title} separator=" - ">
            <SiWhatsapp className="w-5 h-5 text-green-600 hover:scale-110 transition" />
          </WhatsappShareButton>
        </div>
      )}
    </div>
  );
}
