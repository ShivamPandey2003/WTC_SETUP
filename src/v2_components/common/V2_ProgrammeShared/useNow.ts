import { useEffect, useState } from "react";

/** Current time, refreshed every minute (drives the "now" line and live badges). */
export function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return {
    now,
    today: now.toLocaleDateString("en-CA"), // YYYY-MM-DD
    minutes: now.getHours() * 60 + now.getMinutes(),
  };
}
