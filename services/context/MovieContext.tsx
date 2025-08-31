import React, { createContext, useState, useCallback, ReactNode, useContext } from 'react';
import { Movie, GroundingChunk, User } from '../../types';
import { fetchMoviesFromAI, fetchMovieDetailsFromAI, fetchRecommendedMoviesFromAI } from '../geminiService';

interface MovieContextType {
  movies: Movie[];
  featuredMovies: Movie[];
  trendingMovies: Movie[];
  recommendedMovies: Movie[];
  currentMovie: Movie | null;
  currentMovieSources: GroundingChunk[];
  isLoading: boolean;
  error: string | null;
  fetchMovies: (genre?: string, searchTerm?: string) => Promise<void>;
  fetchMovieById: (id: string, title: string) => Promise<void>;
  fetchRecommendations: (user: User) => Promise<void>;
  clearCurrentMovie: () => void;
  addMovie: (movie: Movie) => void;
  removeMovie: (movieId: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [currentMovieSources, setCurrentMovieSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async (genre: string = '', searchTerm: string = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const allMovies = await fetchMoviesFromAI(genre, searchTerm);
      if (genre || searchTerm) {
        setMovies(allMovies);
      } else {
        setFeaturedMovies(allMovies.slice(0, 10));
        setTrendingMovies(allMovies.slice(10, 20));
        setMovies(allMovies);
      }
    } catch (e) {
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchRecommendations = useCallback(async (user: User) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const highRatedReviews = user.reviews.filter(r => r.rating >= 4);
      const genresFromReviews = highRatedReviews.map(r => movies.find(m => m.id === r.movieId)?.genre).filter(Boolean) as string[];
      const genresFromWatchlist = user.watchlist.map(m => m.genre);
      const favoriteGenres = [...new Set([...genresFromReviews, ...genresFromWatchlist])];
      const seenMovieTitles = [...user.reviews.map(r => r.movieTitle), ...user.watchlist.map(m => m.title)].filter(Boolean) as string[];
      
      if (favoriteGenres.length > 0) {
        const recommendations = await fetchRecommendedMoviesFromAI(favoriteGenres, seenMovieTitles);
        setRecommendedMovies(recommendations);
      }
    } catch (e) {
      setError('Failed to fetch recommendations.');
    } finally {
      setIsLoading(false);
    }
  }, [movies]);


  const fetchMovieById = useCallback(async (id: string, title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { movie: movieDetails, sources } = await fetchMovieDetailsFromAI(id, title);
      setCurrentMovie(movieDetails);
      setCurrentMovieSources(sources);
    } catch (e) {
      setError('Failed to fetch movie details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const clearCurrentMovie = () => {
    setCurrentMovie(null);
    setCurrentMovieSources([]);
  };
  
  const addMovie = (movie: Movie) => {
    setMovies(prev => [movie, ...prev]);
    setFeaturedMovies(prev => [movie, ...prev].slice(0,6));
  };
  
  const removeMovie = (movieId: string) => {
    setMovies(prev => prev.filter(m => m.id !== movieId));
    setFeaturedMovies(prev => prev.filter(m => m.id !== movieId));
    setTrendingMovies(prev => prev.filter(m => m.id !== movieId));
    setRecommendedMovies(prev => prev.filter(m => m.id !== movieId));
  };


  return (
    <MovieContext.Provider value={{ movies, featuredMovies, trendingMovies, recommendedMovies, currentMovie, currentMovieSources, isLoading, error, fetchMovies, fetchMovieById, fetchRecommendations, clearCurrentMovie, addMovie, removeMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};