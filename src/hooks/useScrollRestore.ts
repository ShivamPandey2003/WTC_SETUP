import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export function useScrollRestore(elementId: string) {
  const { pathname } = useLocation();
  const lastPathname = useRef<string>("");

  // Save scroll BEFORE pathname changes
  useEffect(() => {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Save the OLD route's scroll before leaving
    if (lastPathname.current && lastPathname.current !== pathname) {
      sessionStorage.setItem(
        `scroll:${lastPathname.current}`,
        String(el.scrollTop)
      );
    }

    lastPathname.current = pathname;
  }, [pathname, elementId]);

  // Restore scroll AFTER content renders (small delay)
  useEffect(() => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const saved = sessionStorage.getItem(`scroll:${pathname}`);
    if (!saved) return;

    // Wait for content to paint before restoring
    const frame = requestAnimationFrame(() => {
      el.scrollTop = Number(saved);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, elementId]);
}