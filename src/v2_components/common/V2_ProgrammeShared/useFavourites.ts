import { useState } from "react";

const FAVOURITES_KEY = "wtc_programme_favourites";

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>(read);

  const toggleFavourite = (id: string) => {
    setFavourites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable: favourites stay in memory for this visit
      }
      return next;
    });
  };

  return { favourites, isFavourite: (id: string) => favourites.includes(id), toggleFavourite };
}

export type Favourites = ReturnType<typeof useFavourites>;
