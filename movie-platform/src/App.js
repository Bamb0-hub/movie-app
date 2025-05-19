// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import RegisterForm   from "./components/RegisterForm";
import LoginForm      from "./components/LoginForm";
import AddMovieForm   from "./components/AddMovieForm";
import MovieList      from "./components/MovieList";
import CreateListForm from "./components/CreateListForm";
import UserLists      from "./components/UserLists";

// Import default styles (if needed) or comment out App.css
import './App.css';
// Dark/Modern alternative theme
import './styles_alt.css';

function AuthPage({ onLoginSuccess }) {
  return (
    <div className="auth-wrapper">
      <div className="card">
        <h2>Συνδεση Χρηστη</h2>
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
      <div className="card">
        <h2>Εγγραφη Χρηστη</h2>
        <RegisterForm />
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="card add-movie">
        <h2>Προσθηκη Ταινιας / Σειρας</h2>
        <AddMovieForm />
      </div>

      <div className="card movie-list">
        <h2>Λιστα Ταινιων / Σειρων</h2>
        <MovieList />
      </div>

      <div className="card list-form">
        <h2>Δημιουργια Προσωπικης Λιστας</h2>
        <CreateListForm />
      </div>

      <div className="card user-lists">
        <h2>Οι Λiστες Μου</h2>
        <UserLists />
      </div>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <div className="App">
        <h1>Movie & Series Platform</h1>
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/auth"
            element={<AuthPage onLoginSuccess={() => setLoggedIn(true)} />}
          />
          <Route
            path="/dashboard"
            element={
              loggedIn ? <DashboardPage /> : <Navigate to="/auth" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
