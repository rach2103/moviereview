import React, { useState } from 'react';
import { submitReviewToAI } from '../services/geminiService';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface ReviewFormProps {
  movieId: string;
  movieTitle: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, movieTitle }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { addReview } = useUser();
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        setError('You must be logged in to write a review.');
        return;
    }
    if (rating === 0 || !text) {
      setError('Please provide a rating and a review text.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    const result = await submitReviewToAI(movieId, { rating, text });
    
    setIsSubmitting(false);
    if (result.success) {
      addReview(currentUser.id, movieId, movieTitle, { rating, text });
      setSuccess('Your review has been submitted!');
      setRating(0);
      setText('');
    } else {
      setError('Failed to submit review. Please try again.');
    }
  };
  
  if (!currentUser) {
    return (
        <div className="bg-brand-gray p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-3">Want to share your thoughts?</h3>
            <p className="text-gray-400 mb-4">Please log in to write a review.</p>
            <Link to="/login" className="bg-brand-red text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition-colors">
                Login
            </Link>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-gray p-6 rounded-lg space-y-4">
      <div>
        <label className="block text-white font-semibold mb-2">Your Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl transition-colors duration-200 ${star <= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="reviewText" className="block text-white font-semibold mb-2">Your Review</label>
        <textarea
          id="reviewText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you think?"
          rows={5}
          className="w-full bg-brand-light-gray text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
        />
      </div>
      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-red text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}
    </form>
  );
};

export default ReviewForm;