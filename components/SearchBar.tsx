
import React, { useState } from 'react';
import { GENRES } from '../types';

interface SearchBarProps {
  onSearch: (genre: string, searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(genre, searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="bg-brand-gray p-6 rounded-lg flex flex-col md:flex-row items-center gap-4 mb-8">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow w-full md:w-auto bg-brand-light-gray text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
      />
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full md:w-auto bg-brand-light-gray text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
      >
        <option value="">All Genres</option>
        {GENRES.map(g => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <button type="submit" className="w-full md:w-auto bg-brand-red text-white font-bold px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-300">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
