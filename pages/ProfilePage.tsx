import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useUser } from '../services/context/UserContext';
import { useAuth } from '../services/context/AuthContext';
import MovieCard from '../components/MovieCard';
import ErrorMessage from '../components/ErrorMessage';
import UserListModal from '../components/UserListModal';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { currentUser } = useAuth();
  const { getUserById, followUser, unfollowUser, isFollowing } = useUser();
  const [modalContent, setModalContent] = useState<{ title: string; users: User[] } | null>(null);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const userToDisplay = userId ? getUserById(userId) : currentUser;
  const isCurrentUserProfile = !userId || userToDisplay?.id === currentUser.id;

  if (!userToDisplay) {
    return <ErrorMessage message="User not found." />;
  }
  
  const followers = userToDisplay.followers.map(id => getUserById(id)).filter((u): u is User => u !== undefined);
  const following = userToDisplay.following.map(id => getUserById(id)).filter((u): u is User => u !== undefined);
  
  const userIsFollowing = isFollowing(currentUser.id, userToDisplay.id);
  
  const handleFollowToggle = () => {
      if (!isCurrentUserProfile) {
          if(userIsFollowing) {
              unfollowUser(currentUser.id, userToDisplay.id);
          } else {
              followUser(currentUser.id, userToDisplay.id);
          }
      }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 bg-brand-gray p-8 rounded-lg">
        <img 
          src={userToDisplay.profilePictureUrl} 
          alt={userToDisplay.username} 
          className="w-32 h-32 rounded-full border-4 border-brand-red"
        />
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold">{userToDisplay.username}</h1>
          <p className="text-gray-400">{userToDisplay.email}</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-2 text-gray-300">
              <span><span className="font-bold text-white">{userToDisplay.reviews.length}</span> Reviews</span>
              <button onClick={() => setModalContent({ title: 'Followers', users: followers })} className="hover:text-white transition-colors">
                <span className="font-bold text-white">{followers.length}</span> Followers
              </button>
              <button onClick={() => setModalContent({ title: 'Following', users: following })} className="hover:text-white transition-colors">
                <span className="font-bold text-white">{following.length}</span> Following
              </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Joined on {new Date(userToDisplay.joinDate).toLocaleDateString()}
          </p>
        </div>
        {!isCurrentUserProfile && (
            <button 
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-lg font-bold transition-colors duration-300 ${userIsFollowing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-brand-red hover:bg-red-700'}`}
            >
                {userIsFollowing ? 'Unfollow' : 'Follow'}
            </button>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-white border-l-4 border-brand-red pl-4">Watchlist</h2>
        {userToDisplay.watchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {userToDisplay.watchlist.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 bg-brand-gray p-6 rounded-lg">{isCurrentUserProfile ? 'Your watchlist is empty. Add some movies!' : `${userToDisplay.username}'s watchlist is empty.`}</p>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-white border-l-4 border-brand-red pl-4">Reviews</h2>
        {userToDisplay.reviews.length > 0 ? (
          <div className="space-y-4">
            {userToDisplay.reviews.map((review, index) => (
              <div key={index} className="bg-brand-gray p-6 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-semibold">{review.movieTitle ? `Review for "${review.movieTitle}"` : "Review"}</h3>
                        <p className="text-yellow-400 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                    </div>
                    <p className="text-sm text-gray-400">{new Date(review.timestamp).toLocaleDateString()}</p>
                </div>
                <p className="mt-2 text-gray-300">{review.text}</p>
              </div>
            ))}
          </div>
        ) : (
           <p className="text-gray-400 bg-brand-gray p-6 rounded-lg">{isCurrentUserProfile ? "You haven't written any reviews yet." : `${userToDisplay.username} hasn't written any reviews yet.`}</p>
        )}
      </section>
      
      {modalContent && (
        <UserListModal 
            title={modalContent.title} 
            users={modalContent.users} 
            onClose={() => setModalContent(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;