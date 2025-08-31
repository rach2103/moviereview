import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface UserListModalProps {
  title: string;
  users: User[];
  onClose: () => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ title, users, onClose }) => {
  useEffect(() => {
    // When the modal is mounted, we want to prevent the background from scrolling
    document.body.style.overflow = 'hidden';
    // When the modal is unmounted, we want to restore the scroll
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-brand-gray rounded-lg p-6 w-full max-w-md max-h-[80vh] flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="overflow-y-auto space-y-4 pr-2">
          {users.length > 0 ? (
            users.map(user => (
              <Link 
                to={`/profile/${user.id}`} 
                key={user.id}
                onClick={onClose} // Close modal on navigation
                className="flex items-center p-2 rounded-lg hover:bg-brand-light-gray transition-colors duration-200"
              >
                <img src={user.profilePictureUrl} alt={user.username} className="w-12 h-12 rounded-full mr-4" />
                <span className="text-lg font-semibold">{user.username}</span>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">No users to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
