"use client";

import { useState, useEffect } from "react";
import { type AnnouncementBar } from "@/services/announcement-bar.service";
import { AnnouncementPlaceholder } from "@/components/home/StorefrontEmptyState";

interface TopHeaderBarProps {
  serverAnnouncementBars?: AnnouncementBar[];
}

export default function TopHeaderBar({ serverAnnouncementBars }: TopHeaderBarProps) {

  const bars = serverAnnouncementBars ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // ২. Auto-rotate effect
  useEffect(() => {
    if (bars.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bars.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bars.length]);

  if (bars.length === 0) return <AnnouncementPlaceholder />;

  const currentBar = bars[currentIndex] || bars[0];

  return (
    <div
      className="h-8 text-xs transition-colors duration-300"
      role="banner"
      aria-label="Announcement bar"
      style={{
        backgroundColor: currentBar.background_color,
        color: currentBar.text_color,
      }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4">
        <span className="hidden sm:inline" aria-label="Left announcement">
          {currentBar.left_text || ""}
        </span>
        <span className="mx-auto sm:mx-0" aria-label="Center announcement">
          {currentBar.center_text || ""}
        </span>
        <span className="hidden sm:inline" aria-label="Right announcement">
          {currentBar.right_text || ""}
        </span>
      </div>
    </div>
  );
}
