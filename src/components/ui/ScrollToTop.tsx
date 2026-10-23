"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    // Let anchor links keep their own scroll target.
    if (window.location.hash) return;

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    scrollToTop();
    // Apply again after the router finishes its scroll handling for this commit.
    const frame = window.requestAnimationFrame(scrollToTop);

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
