import React from 'react';
import { Link } from 'react-router-dom';
import { Review } from '../types';
import { useUser } from '../services/context/UserContext';
import { useAuth } from '../services/context/AuthContext';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const { isFollowing } = useUser();
  const { currentUser } = useAuth();
  
  const userIsFollowing = (authorId: string) => {
    if (!currentUser) return false;
    return isFollowing(currentUser.id, authorId);
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={`${review.userId}-${review.timestamp}`} className={`bg-brand-gray p-5 rounded-lg border-2 transition-colors ${userIsFollowing(review.userId) ? 'border-brand-red' : 'border-transparent'}`}>
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/profile/${review.userId}`} className="font-bold text-lg text-white hover:text-brand-red transition-colors duration-300">{review.username}</Link>
              <p className="text-yellow-400 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
            </div>
            <p className="text-sm text-gray-400">{new Date(review.timestamp).toLocaleDateString()}</p>
          </div>
          <p className="mt-3 text-gray-300">{review.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;