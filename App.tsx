import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { MovieProvider } from './services/context/MovieContext';
import { UserProvider } from './services/context/UserContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';
import FeedPage from './pages/FeedPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AuthProvider } from './services/context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <UserProvider>
          <MovieProvider>
            <div className="min-h-screen bg-brand-black flex flex-col">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/movie/:id" element={<MovieDetailPage />} />
                  
                  <Route path="/feed" element={
                    <ProtectedRoute>
                      <FeedPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/:userId" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                   <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </MovieProvider>
        </UserProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;