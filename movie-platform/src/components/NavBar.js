// src/components/NavBar.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function NavBar({ onLogout }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/me');
        setProfile(res.data);
      } catch (err) {
        console.error('Load profile error:', err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 1rem',
      backgroundColor: '#282c34',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
        <button
          onClick={onLogout}
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
      </div>
    </nav>
  );
}

export default NavBar;
