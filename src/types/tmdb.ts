export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  vote_count?: number;
  original_language?: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  vote_average: number;
  runtime?: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  season_number: number;
  episode_count: number;
  episodes?: Episode[];
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  number_of_seasons?: number;
  genres?: { id: number; name: string }[];
  vote_count?: number;
  original_language?: string;
  seasons?: Season[];
}

export interface WatchHistoryItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  timestamp: number;
  season?: number;
  episode?: number;
}