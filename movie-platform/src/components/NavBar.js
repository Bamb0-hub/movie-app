// src/components/NavBar.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function NavBar({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/user/me')
      .then(res => setProfile(res.data))
      .catch(() => {
        // π.χ. ληγμένο token ή άλλο σφάλμα
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Πάντα επιστρέφουμε το nav
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 1rem',
      backgroundColor: '#282c34',
      color: '#fff'
    }}>
      {/* Αριστερά: στοιχεία χρήστη, αν υπάρχουν */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {loading && <span>Loading…</span>}

        {!loading && profile && (
          <>
            <span>Welcome, {profile.username}</span>
            <span>🏅 {profile.points} pts</span>
            <span style={{
              background: '#444',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.85rem'
            }}>
              {profile.level}
            </span>
            {profile.role === 'admin' && (
              <span style={{
                backgroundColor: '#ffa500',
                color: '#fff',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.85rem'
              }}>
                Admin
              </span>
            )}
          </>
        )}
      </div>

      {/* Δεξιά: πάντα Logout */}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          onLogout();
          navigate('/auth');
        }}
        style={{
          backgroundColor: '#61dafb',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </nav>
  );
}
