import { useLayoutEffect, useState } from "react";

const MIN_HEIGHT = 360;

/**
 * Sizes a scroll box to the space left below it in the viewport, so a grid uses the
 * whole screen in any layout (app shell or bare test layout). Re-measures on resize,
 * on page scroll and when the content above it changes size.
 *
 * Uses a callback ref: the element often mounts after a loading state, and a plain
 * ref + mount effect would never see it.
 */
export function useFillViewport<T extends HTMLElement>(bottomGap = 16) {
  const [el, setEl] = useState<T | null>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    if (!el) return;

    const update = () => {
      const top = el.getBoundingClientRect().top;
      setHeight(Math.max(Math.round(window.innerHeight - Math.max(top, 0) - bottomGap), MIN_HEIGHT));
    };

    update();
    const observer = new ResizeObserver(update);
    if (el.parentElement) observer.observe(el.parentElement);
    window.addEventListener("resize", update);
    // capture: the page may scroll inside a layout container rather than the window
    window.addEventListener("scroll", update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [el, bottomGap]);

  return { ref: setEl, el, style: height ? { height } : undefined };
}
