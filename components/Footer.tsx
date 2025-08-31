
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-gray py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} MovieFlix. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by Gemini AI</p>
      </div>
    </footer>
  );
};

export default Footer;
