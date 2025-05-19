import React, { useState } from 'react';
import axios from 'axios';

const ListForm = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/lists/add', { name, userId });
      setSuccess(true);
      setName('');
    } catch (error) {
      console.error('❌ Σφάλμα κατά τη δημιουργία λίστας:', error);
    }
  };

  return (
    <div>
      <h2>Δημιουργία Νέας Λίστας</h2>
      {success && <p style={{ color: 'green' }}>✅ Η λίστα δημιουργήθηκε!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Όνομα Λίστας:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>User ID:</label>
          <input type="text" value={userId} onChange={e => setUserId(e.target.value)} required />
        </div>
        <button type="submit">Δημιουργία</button>
      </form>
    </div>
  );
};

export default ListForm;
