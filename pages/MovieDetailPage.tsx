import React, { useEffect, useMemo } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import StarRating from '../components/StarRating';
import { useUser } from '../context/UserContext';
import RatingDistributionChart from '../components/RatingDistributionChart';
import { useAuth } from '../context/AuthContext';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { title, posterUrl } = location.state as { title: string, posterUrl: string };
  const { currentUser } = useAuth();
  
  const { currentMovie, currentMovieSources, isLoading, error, fetchMovieById, clearCurrentMovie } = useMovies();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useUser();
  
  useEffect(() => {
    if (id && title) {
      fetchMovieById(id, title);
    }

    return () => {
      clearCurrentMovie();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, title]);

  const ratingCounts = useMemo(() => {
    if (!currentMovie?.reviews) return [];
    const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    currentMovie.reviews.forEach(review => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    return Object.entries(counts).map(([rating, count]) => ({ rating: `${rating} Star`, count })).reverse();
  }, [currentMovie?.reviews]);

  if (isLoading) return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
  if (error) return <ErrorMessage message={error} />;
  
  if (!currentUser) return <Navigate to="/login" />;

  if (!currentMovie) return (
      <div className="flex flex-col items-center justify-center h-96">
        <img src={posterUrl} alt={title} className="w-48 h-auto rounded-lg shadow-lg mb-4 opacity-50"/>
        <p className="text-xl text-gray-400">Loading movie details...</p>
        <LoadingSpinner />
      </div>
  );
  
  const userIsInWatchlist = isInWatchlist(currentUser.id, currentMovie.id);

  const handleWatchlistToggle = () => {
    if (userIsInWatchlist) {
      removeFromWatchlist(currentUser.id, currentMovie.id);
    } else {
      addToWatchlist(currentUser.id, currentMovie);
    }
  };
  
  const safeAverageRating = currentMovie.averageRating ?? 0;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img src={currentMovie.posterUrl} alt={currentMovie.title} className="rounded-lg w-full shadow-2xl shadow-brand-red/20" />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-5xl font-bold mb-2">{currentMovie.title}</h1>
          <div className="flex items-center space-x-4 mb-4 text-gray-400">
            <span>{currentMovie.releaseYear}</span>
            <span>&bull;</span>
            <span>{currentMovie.genre}</span>
            <span>&bull;</span>
            <span>Directed by {currentMovie.director}</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <StarRating rating={safeAverageRating} />
            <span className="text-yellow-400 font-bold text-lg">{safeAverageRating.toFixed(1)}</span>
          </div>
          <p className="text-lg mb-6">{currentMovie.synopsis}</p>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Cast</h3>
            <p className="text-gray-300">{currentMovie.cast.join(', ')}</p>
          </div>
          <button
            onClick={handleWatchlistToggle}
            className={`px-6 py-3 rounded-lg font-bold transition-colors duration-300 ${userIsInWatchlist ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-brand-red hover:bg-red-700'} text-white`}
          >
            {userIsInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
          </button>
        </div>
      </div>
      
      {currentMovie.trailerUrl && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Trailer</h2>
          <div className="relative" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
            <iframe
              src={currentMovie.trailerUrl}
              title={`${currentMovie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full rounded-lg border-0"
            ></iframe>
          </div>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-4">Reviews</h2>
            {currentMovie.reviews && currentMovie.reviews.length > 0 ? (
                <>
                    <div className="bg-brand-gray p-6 rounded-lg mb-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Ratings Distribution</h3>
                        <RatingDistributionChart data={ratingCounts} />
                    </div>
                    <ReviewList reviews={currentMovie.reviews} />
                </>
            ) : (
                <p className="text-gray-400">No reviews yet.</p>
            )}
        </div>
        <div>
            <h2 className="text-3xl font-bold mb-4">Write a Review</h2>
            <ReviewForm movieId={currentMovie.id} movieTitle={currentMovie.title} />
        </div>
      </div>
      
      {currentMovieSources && currentMovieSources.length > 0 && (
        <div className="mt-12 pt-8 border-t border-brand-light-gray">
          <h2 className="text-2xl font-bold mb-4">Data Sources</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            {currentMovieSources.map((source, index) => (
              source.web && (
                <li key={index}>
                  <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;