/**
 * The user's agenda ("favourites"), as the agenda components use it. Membership comes
 * from the server (`is_in_agenda`); toggling calls program/agenda/toggle.
 */
export type Favourites = {
  /** Ids of every session in the agenda, across all days. */
  favourites: string[];
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
};
