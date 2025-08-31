import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { Review } from '../types';

const FeedPage: React.FC = () => {
  const { allUsers } = useUser();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const feedReviews = allUsers
    .filter(user => currentUser.following.includes(user.id))
    .flatMap(user => user.reviews)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-white border-l-4 border-brand-red pl-4">
        Your Feed
      </h1>
      
      {feedReviews.length > 0 ? (
        <div className="space-y-6">
          {feedReviews.map((review: Review, index: number) => (
            <div key={`${review.userId}-${index}`} className="bg-brand-gray p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    <Link to={`/profile/${review.userId}`} className="font-bold text-white hover:text-brand-red transition-colors">{review.username}</Link> reviewed <span className="font-bold text-white">{review.movieTitle || 'a movie'}</span>
                  </p>
                  <p className="text-yellow-400 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                </div>
                <p className="text-sm text-gray-400">{new Date(review.timestamp).toLocaleDateString()}</p>
              </div>
              <p className="mt-3 text-gray-300 italic">"{review.text}"</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-brand-gray p-10 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Your feed is quiet...</h2>
          <p className="text-gray-400">Follow other users to see their reviews here!</p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;