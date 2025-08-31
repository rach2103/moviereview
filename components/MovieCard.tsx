
import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link 
      to={`/movie/${movie.id}`} 
      state={{ title: movie.title, posterUrl: movie.posterUrl }}
      className="group bg-brand-gray rounded-lg overflow-hidden shadow-lg hover:shadow-brand-red/40 transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="relative">
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto aspect-[2/3] object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity duration-300 flex items-end p-4">
          <div>
            <h3 className="text-white text-lg font-bold leading-tight">{movie.title}</h3>
            <div className="flex items-center mt-1">
              <span className="text-yellow-400 text-sm font-bold">★ {(movie.averageRating ?? 0).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;