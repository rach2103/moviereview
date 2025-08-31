import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Movie, Review, User } from '../types';

interface UserContextType {
  allUsers: User[];
  getUserById: (userId: string) => User | undefined;
  addToWatchlist: (userId: string, movie: Movie) => void;
  removeFromWatchlist: (userId: string, movieId: string) => void;
  isInWatchlist: (userId: string, movieId: string) => boolean;
  addReview: (userId: string, movieId: string, movieTitle: string, review: Omit<Review, 'userId' | 'username' | 'timestamp'>) => void;
  followUser: (currentUserId: string, userIdToFollow: string) => void;
  unfollowUser: (currentUserId: string, userIdToUnfollow: string) => void;
  isFollowing: (currentUserId: string, userId: string) => boolean;
  removeUser: (userIdToRemove: string) => void;
}

const mockUsers: User[] = [
  {
    id: 'user-123',
    username: 'CinephileChris',
    email: 'chris@example.com',
    profilePictureUrl: 'https://picsum.photos/seed/user123/200/200',
    joinDate: '2023-01-15T10:00:00Z',
    role: 'user',
    reviews: [
      { userId: 'user-123', username: 'CinephileChris', movieId: 'mock-movie-1', movieTitle: 'Inception', rating: 5, text: 'Mind-bending masterpiece!', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
    ],
    watchlist: [],
    following: ['user-456'],
    followers: ['user-789'],
  },
  {
    id: 'user-456',
    username: 'MovieMavenMary',
    email: 'mary@example.com',
    profilePictureUrl: 'https://picsum.photos/seed/user456/200/200',
    joinDate: '2022-11-20T14:30:00Z',
    role: 'user',
    reviews: [
      { userId: 'user-456', username: 'MovieMavenMary', movieId: 'mock-movie-2', movieTitle: 'The Grand Budapest Hotel', rating: 4, text: 'Visually stunning and quirky.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { userId: 'user-456', username: 'MovieMavenMary', movieId: 'mock-movie-3', movieTitle: 'Parasite', rating: 5, text: 'A thrilling social commentary.', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
    watchlist: [],
    following: [],
    followers: ['user-123'],
  },
  {
    id: 'user-789',
    username: 'FilmFanFrank',
    email: 'frank@example.com',
    profilePictureUrl: 'https://picsum.photos/seed/user789/200/200',
    joinDate: '2023-03-10T09:00:00Z',
    role: 'admin',
    reviews: [
       { userId: 'user-789', username: 'FilmFanFrank', movieId: 'mock-movie-4', movieTitle: 'Dune', rating: 4, text: 'Epic scale, but feels like part one.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
    ],
    watchlist: [],
    following: ['user-123'],
    followers: [],
  }
];


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  
  const getUserById = (userId: string): User | undefined => {
    return allUsers.find(u => u.id === userId);
  };
  
  const followUser = (currentUserId: string, userIdToFollow: string) => {
    if (userIdToFollow === currentUserId) return;
    setAllUsers(prev => prev.map(user => {
      if (user.id === currentUserId) {
        return { ...user, following: [...new Set([...user.following, userIdToFollow])] };
      }
      if (user.id === userIdToFollow) {
        return { ...user, followers: [...new Set([...user.followers, currentUserId])] };
      }
      return user;
    }));
  };

  const unfollowUser = (currentUserId: string, userIdToUnfollow: string) => {
    setAllUsers(prev => prev.map(user => {
      if (user.id === currentUserId) {
        return { ...user, following: user.following.filter(id => id !== userIdToUnfollow) };
      }
      if (user.id === userIdToUnfollow) {
        return { ...user, followers: user.followers.filter(id => id !== currentUserId) };
      }
      return user;
    }));
  };
  
  const isFollowing = (currentUserId: string, userId: string): boolean => {
    const currentUser = getUserById(currentUserId);
    return currentUser?.following.includes(userId) ?? false;
  };

  const addReview = (userId: string, movieId: string, movieTitle: string, review: Omit<Review, 'userId' | 'username' | 'timestamp'>) => {
    const currentUser = getUserById(userId);
    if (!currentUser) return;

    const newReview: Review = {
        ...review,
        userId: currentUser.id,
        username: currentUser.username,
        timestamp: new Date().toISOString(),
        movieId,
        movieTitle
    };
    setAllUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return { ...user, reviews: [newReview, ...user.reviews] };
      }
      return user;
    }));
  };

  const addToWatchlist = (userId: string, movie: Movie) => {
    setAllUsers(prev => prev.map(user => {
        if (user.id === userId && !user.watchlist.some(m => m.id === movie.id)) {
            return { ...user, watchlist: [...user.watchlist, movie] };
        }
        return user;
    }));
  };

  const removeFromWatchlist = (userId: string, movieId: string) => {
    setAllUsers(prev => prev.map(user => {
        if (user.id === userId) {
            return { ...user, watchlist: user.watchlist.filter(m => m.id !== movieId) };
        }
        return user;
    }));
  };
  
  const isInWatchlist = (userId: string, movieId: string) => {
    const currentUser = getUserById(userId);
    return currentUser?.watchlist.some(m => m.id === movieId) ?? false;
  };
  
  const removeUser = (userIdToRemove: string) => {
    setAllUsers(prev => prev.filter(user => user.id !== userIdToRemove));
  };

  return (
    <UserContext.Provider value={{ allUsers, getUserById, addToWatchlist, removeFromWatchlist, isInWatchlist, addReview, followUser, unfollowUser, isFollowing, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};