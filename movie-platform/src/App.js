// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import api from "./api/axios";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import AddMovieForm from "./components/AddMovieForm";
import MovieList from "./components/MovieList";
import UserLists from "./components/UserLists";
import NavBar from "./components/NavBar";

import './App.css';
import './styles_alt.css';

const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const { username, role, id } = JSON.parse(atob(token.split('.')[1]));
    return { username, role, id };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

function App() {
  const [user, setUser] = useState(getUserFromToken);
  const [movies, setMovies] = useState([]);

  // Φόρτωση ταινιών όταν ο χρήστης συνδεθεί
  useEffect(() => {
    if (!user) return;
    api.get('/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error('Load movies error:', err));
  }, [user]);

  // Callbacks
const handleLoginSuccess = ({ token, user: u }) => {
  localStorage.setItem("token", token);
  // Παίρνουμε ΟΝΟΜΑ χρήστη (username) και ROLE από το response
  setUser({
    username: u.username, 
    role: u.role,
    id: u.id
  });
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMovies([]);
  };

  const handleMovieAdded = newMovie => {
    setMovies(prev => [newMovie, ...prev]);
  };

  return (
    <Router>
      <div className="App">
        <header className="header-bar">
          <h1>Movie &amp; Series Platform</h1>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace />
                   : <Navigate to="/auth" replace />
            }
          />

          <Route
            path="/auth"
            element={
              user ? <Navigate to="/dashboard" replace />
                   : <AuthPage onLoginSuccess={handleLoginSuccess} />
            }
          />

          <Route
            path="/dashboard"
            element={
              user ? (
                <DashboardPage
                  user={user}
                  onLogout={handleLogout}
                  movies={movies}
                  onMovieAdded={handleMovieAdded}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// AuthPage
function AuthPage({ onLoginSuccess }) {
  return (
    <div className="auth-wrapper">
      <div className="card">
        <h2>Συνδεση Χρηστη</h2>
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
      <div className="card">
        <h2>Εγγραφη Χρηστη</h2>
        <RegisterForm onRegisterSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}

// DashboardPage
function DashboardPage({ user, onLogout, movies, onMovieAdded }) {
  return (
    <>
      <NavBar user={user} onLogout={onLogout} />
      <div className="dashboard">
        {user.role === 'admin' && (
          <div className="card add-movie">
            <h2> Προσθηκη Ταινιας / Σειρας</h2>
            <AddMovieForm onMovieAdded={onMovieAdded} />
          </div>
        )}
        <div className="card movie-list">
          <h2>Λιστα Ταινιων / Σειρων</h2>
          <MovieList movies={movies} />
        </div>
        <div className="card user-lists">
          <UserLists />
        </div>
      </div>
    </>
  );
}

export default App;
