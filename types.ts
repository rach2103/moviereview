export interface Review {
  userId: string;
  username: string;
  rating: number;
  text: string;
  timestamp: string;
  movieId?: string;
  movieTitle?: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  director: string;
  cast: string[];
  synopsis: string;
  posterUrl: string;
  averageRating: number;
  reviews?: Review[];
  trailerUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl: string;
  joinDate: string;
  reviews: Review[];
  watchlist: Movie[];
  role: 'user' | 'admin';
  following: string[]; // Array of user IDs
  followers: string[]; // Array of user IDs
}

export const GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Thriller", "Romance", "Animation"];

export interface GroundingSource {
  // Fix: Made uri and title optional to match the type from @google/genai, resolving the type error.
  uri?: string;
  title?: string;
}

export interface GroundingChunk {
  // Fix: Made `web` property optional to match the type from `@google/genai`, resolving the type error in `geminiService.ts`.
  web?: GroundingSource;
}