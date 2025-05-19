import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddToListForm = ({ movieId }) => {
  const [lists, setLists]     = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [message, setMessage] = useState('');

  // Φόρτωση των λιστών του χρήστη
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const res = await axios.get(
          `http://localhost:5000/api/lists/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLists(res.data);
      } catch (err) {
        console.error(err);
        setMessage('Σφάλμα φορτώματος λιστών');
      }
    };
    fetchLists();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedList) {
      setMessage('Επίλεξε λίστα');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/lists/${selectedList}/add-movie`,
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Η ταινία προστέθηκε στη λίστα!');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Σφάλμα προσθήκης');
    }
  };

  return (
    <form onSubmit={handleAdd} style={{ marginTop: '1rem' }}>
      <label>Προσθήκη σε λίστα:</label>
      <select
        value={selectedList}
        onChange={e => setSelectedList(e.target.value)}
      >
        <option value="">-- Επίλεξε λίστα --</option>
        {lists.map(list => (
          <option key={list._id} value={list._id}>
            {list.name}
          </option>
        ))}
      </select>
      <button type="submit">Προσθήκη</button>
      {message && <p className="success">{message}</p>}
    </form>
  );
};

export default AddToListForm;
