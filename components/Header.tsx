import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <header className="bg-brand-black bg-opacity-80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-3xl font-bold text-brand-red tracking-wider">
          MovieFlix
        </NavLink>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => `text-white hover:text-brand-red transition-colors duration-300 ${isActive ? 'text-brand-red font-semibold' : ''}`}
              >
                Home
              </NavLink>
            </li>
            {currentUser && (
              <li>
                <NavLink 
                  to="/feed" 
                  className={({ isActive }) => `text-white hover:text-brand-red transition-colors duration-300 ${isActive ? 'text-brand-red font-semibold' : ''}`}
                >
                  Feed
                </NavLink>
              </li>
            )}
            <li>
              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                     <img src={currentUser.profilePictureUrl} alt={currentUser.username} className="w-8 h-8 rounded-full border-2 border-gray-500" />
                     <span className="text-white font-semibold">{currentUser.username}</span>
                     <svg className={`w-4 h-4 text-white transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-brand-gray rounded-md shadow-lg py-1 animate-dropdown">
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-brand-light-gray">My Profile</Link>
                      {currentUser.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-brand-light-gray">Admin Dashboard</Link>
                      )}
                      <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-brand-light-gray">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => `text-white hover:text-brand-red transition-colors duration-300 ${isActive ? 'text-brand-red font-semibold' : ''}`}
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;