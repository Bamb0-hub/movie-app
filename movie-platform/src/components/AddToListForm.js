// src/components/AddToListForm.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function AddToListForm({ movieId, onAddSuccess }) {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Φόρτωση λιστών του χρήστη
  const fetchLists = async () => {
    try {
      const res = await api.get('/lists/my');
      setLists(res.data);
    } catch (err) {
      console.error('Load lists error:', err);
      setError('Σφάλμα φόρτωσης λιστών');
    }
  };

  useEffect(() => {
    fetchLists();
    window.addEventListener('listCreated', fetchLists);
    window.addEventListener('movieAddedToList', fetchLists);
    return () => {
      window.removeEventListener('listCreated', fetchLists);
      window.removeEventListener('movieAddedToList', fetchLists);
    };
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedListId) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.post(
        `/lists/${selectedListId}/add-movie`,
        { movieId }
      );
      if (onAddSuccess) onAddSuccess(res.data);
      // Εμφάνιση μηνύματος επιτυχίας
      setSuccess(true);
      // Ειδοποίηση για ανανέωση λιστών
      window.dispatchEvent(new CustomEvent('movieAddedToList', { detail: { listId: selectedListId } }));
      // Καθαρισμός επιτυχίας μετά 3 δευτερόλεπτα
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Add to list error:', err);
      setError('Αποτυχία προσθήκης στην λίστα');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} style={{ marginTop: '0.5rem' }}>
      <label>
        Προσθήκη σε λίστα:
        <select
          value={selectedListId}
          onChange={e => setSelectedListId(e.target.value)}
          disabled={loading || lists.length === 0}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="">-- Επιλέξτε λίστα --</option>
          {lists.map(list => (
            <option key={list._id} value={list._id}>
              {list.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={loading || !selectedListId} style={{ marginLeft: '0.5rem' }}>
        {loading ? 'Προσθήκη...' : 'ΠΡΟΣΘΗΚΗ'}
      </button>
      {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>Η ταινία προστέθηκε επιτυχώς στη λίστα!</p>}
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
}

export default AddToListForm;
