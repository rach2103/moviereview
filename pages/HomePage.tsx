import React, { useEffect, useState, useMemo } from 'react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import { Movie } from '../types';

const HomePage: React.FC = () => {
  const { movies, featuredMovies, trendingMovies, recommendedMovies, isLoading, error, fetchMovies, fetchRecommendations } = useMovies();
  const { currentUser } = useAuth();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const initialFetch = async () => {
      if (featuredMovies.length === 0 && trendingMovies.length === 0) {
        await fetchMovies();
      }
    };
    initialFetch();
  }, [fetchMovies, featuredMovies, trendingMovies]);
  
  useEffect(() => {
    if (currentUser && movies.length > 0 && recommendedMovies.length === 0) {
        fetchRecommendations(currentUser);
    }
  }, [currentUser, fetchRecommendations, movies, recommendedMovies.length]);

  const handleSearch = (genre: string, searchTerm: string) => {
    setIsSearching(!!genre || !!searchTerm);
    fetchMovies(genre, searchTerm);
  };

  const discoverMovies = useMemo(() => {
    if (isSearching) return [];
    const displayedIds = new Set([
        ...featuredMovies.map(m => m.id),
        ...trendingMovies.map(m => m.id),
        ...recommendedMovies.map(m => m.id),
    ]);
    return movies.filter(m => !displayedIds.has(m.id));
  }, [movies, featuredMovies, trendingMovies, recommendedMovies, isSearching]);

  const renderMovieList = (title: string, movieList: Movie[]) => (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-white border-l-4 border-brand-red pl-4">{title}</h2>
      {movieList.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movieList.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No movies found.</p>
      )}
    </section>
  );

  return (
    <div className="space-y-12">
      <SearchBar onSearch={handleSearch} />
      
      {isLoading && <div className="flex justify-center p-8"><LoadingSpinner /></div>}
      {error && <ErrorMessage message={error} />}
      
      {!isLoading && !error && (
        isSearching ? (
          renderMovieList('Search Results', movies)
        ) : (
          <>
            {currentUser && recommendedMovies.length > 0 && renderMovieList('Recommended For You', recommendedMovies)}
            {featuredMovies.length > 0 && renderMovieList('Featured Movies', featuredMovies)}
            {trendingMovies.length > 0 && renderMovieList('Trending Now', trendingMovies)}
            {discoverMovies.length > 0 && renderMovieList('Discover More', discoverMovies)}
          </>
        )
      )}
    </div>
  );
};

export default HomePage;