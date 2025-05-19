import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Συμπλήρωσε όλα τα πεδία.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        { username: username.trim(), email: email.trim(), password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSuccess('✅ Εγγραφή επιτυχής! Μπορείς τώρα να συνδεθείς.');
      setUsername('');
      setEmail('');
      setPassword('');
      onRegisterSuccess && onRegisterSuccess();
    } catch (err) {
      const body = err.response?.data;
      setError(body?.error || body?.message || 'Σφάλμα κατά την εγγραφή.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label>Όνομα Χρήστη:</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Π.χ. john_doe"
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email@domain.com"
          required
        />

        <label>Κωδικός:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Εγγραφη...' : 'Εγγραφη'}
        </button>
      </form>

      {error && <p style={{ color: '#e06c75', marginTop: '0.5rem' }}>{error}</p>}
      {success && <p style={{ color: '#98c379', marginTop: '0.5rem' }}>{success}</p>}
    </div>
  );
};

export default RegisterForm;
