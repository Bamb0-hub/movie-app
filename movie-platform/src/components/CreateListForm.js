import React, { useState } from 'react';
import axios from 'axios';

const CreateListForm = () => {
  const [name, setName]     = useState('');
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Όνομα λίστας απαιτείται');
      return;
    }
    setError(''); setSuccess(''); setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res   = await axios.post(
        'http://localhost:5000/api/lists/add',
        { name: name.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Δημιουργήθηκε η λίστα "${res.data.name}"`);
      setName('');
    } catch (err) {
      setError(err.response?.data?.error || 'Κάτι πήγε στραβά');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>Νέα Προσωπική Λίστα</h3>
      <form onSubmit={handleSubmit}>
        <label>Όνομα Λίστας</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Δημιουργία...' : 'Δημιουργία Λίστας'}
        </button>
      </form>
      {error   && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default CreateListForm;
