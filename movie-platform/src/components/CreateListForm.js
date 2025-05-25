// src/components/CreateListForm.js
import React, { useState } from 'react';
import api from '../api/axios';

function CreateListForm({ onCreated }) {
  const [name, setName]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/lists', { name: name.trim() });

      if (typeof onCreated === 'function') {
        onCreated(res.data);
      }
      // Ειδοποιούμε όλα τα AddToListForm να ξαναφορτώσουν
      window.dispatchEvent(new Event('listCreated'));

      setName('');
    } catch (err) {
      console.error('Create list error:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Όνομα νέας λίστας"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Δημιουργια...' : 'Δημιουργια Λιστας'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default CreateListForm;
