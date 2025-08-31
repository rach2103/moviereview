import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { GENRES, Movie } from '../types';

const AdminDashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { allUsers, removeUser } = useUser();
    const { movies, addMovie, removeMovie } = useMovies();

    const [newMovie, setNewMovie] = useState({
        title: '',
        genre: GENRES[0],
        releaseYear: new Date().getFullYear(),
        director: '',
        cast: '',
        synopsis: '',
        posterUrl: 'https://picsum.photos/500/750'
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleRemoveUser = (userId: string) => {
        if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
            removeUser(userId);
        }
    };

    const handleRemoveMovie = (movieId: string) => {
        if (window.confirm('Are you sure you want to remove this movie?')) {
            removeMovie(movieId);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'releaseYear' ? parseInt(value, 10) : value;
        setNewMovie(prev => ({ ...prev, [name]: parsedValue }));
    };
    
    const handleAddMovieSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const movieToAdd: Movie = {
            id: crypto.randomUUID(),
            title: newMovie.title,
            genre: newMovie.genre,
            releaseYear: newMovie.releaseYear,
            director: newMovie.director,
            cast: newMovie.cast.split(',').map(c => c.trim()),
            synopsis: newMovie.synopsis,
            posterUrl: newMovie.posterUrl,
            averageRating: 0,
            reviews: [],
        };
        addMovie(movieToAdd);
        setSuccessMessage(`Movie "${movieToAdd.title}" has been added successfully!`);
        // Reset form
        setNewMovie({
            title: '',
            genre: GENRES[0],
            releaseYear: new Date().getFullYear(),
            director: '',
            cast: '',
            synopsis: '',
            posterUrl: 'https://picsum.photos/500/750'
        });
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-white border-l-4 border-brand-red pl-4">Admin Dashboard</h1>

            {/* Movie Management Section */}
            <section className="bg-brand-gray p-6 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Manage Movies</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add New Movie Form */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Add New Movie</h3>
                        <form onSubmit={handleAddMovieSubmit} className="space-y-4">
                            <input name="title" value={newMovie.title} onChange={handleInputChange} placeholder="Title" required className="w-full bg-brand-light-gray p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-red"/>
                            <select name="genre" value={newMovie.genre} onChange={handleInputChange} className="w-full bg-brand-light-gray p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-red">
                                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <input name="releaseYear" type="number" value={newMovie.releaseYear} onChange={handleInputChange} placeholder="Release Year" required className="w-full bg-brand-light-gray p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-red"/>
                            <input name="director" value={newMovie.director} onChange={handleInputChange} placeholder="Director" required className="w-full bg-brand-light-gray p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-red"/>
                            <input name="cast" value={newMovie.cast} onChange={handleInputChange} placeholder="Cast (comma separated)" required className="w-full bg-brand-light-gray p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-red"/>
                            <textarea name="synopsis" value={newMovie.synopsis} onChange={handleInputChange} placeholder="Synopsis" required rows={4} className="w-full bg-brand-light-gray p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-red"/>
                            <button type="submit" className="w-full bg-brand-red text-white font-bold py-2 rounded hover:bg-red-700 transition-colors">Add Movie</button>
                            {successMessage && <p className="text-green-400">{successMessage}</p>}
                        </form>
                    </div>
                    {/* Existing Movies List */}
                    <div>
                         <h3 className="text-2xl font-semibold mb-4">Existing Movies ({movies.length})</h3>
                         <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                            {movies.map(movie => (
                                <div key={movie.id} className="flex justify-between items-center bg-brand-light-gray p-3 rounded">
                                    <span>{movie.title} ({movie.releaseYear})</span>
                                    <button onClick={() => handleRemoveMovie(movie.id)} className="text-red-500 hover:text-red-400 font-semibold">Remove</button>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </section>

            {/* User Management Section */}
            <section className="bg-brand-gray p-6 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">Manage Users ({allUsers.length})</h2>
                 <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                    {allUsers.map(user => (
                        <div key={user.id} className="flex justify-between items-center bg-brand-light-gray p-3 rounded">
                            <div>
                                <p className="font-bold">{user.username} <span className="text-xs font-normal text-gray-400">{user.role}</span></p>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                            {user.id !== currentUser?.id ? (
                                <button onClick={() => handleRemoveUser(user.id)} className="text-red-500 hover:text-red-400 font-semibold">Remove</button>
                            ) : (
                                <span className="text-gray-500 text-sm">Cannot remove self</span>
                            )}
                        </div>
                    ))}
                 </div>
            </section>
        </div>
    );
};

export default AdminDashboardPage;
