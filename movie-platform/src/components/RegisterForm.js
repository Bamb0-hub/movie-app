import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  // Επιτρεπόμενοι domains για έλεγχο email
  const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Καθαρισμός προηγούμενων μηνυμάτων
    setError('');
    setSuccess('');

    // Έλεγχος υποχρεωτικών πεδίων
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Παρακαλώ συμπλήρωσε όλα τα υποχρεωτικά πεδία.');
      return;
    }

    // Έλεγχος επιτρεπόμενου domain
    const domain = email.trim().split('@')[1]?.toLowerCase() || '';
    if (!allowedDomains.includes(domain)) {
      setError('Χρησιμοποίηστε έγκυρο email.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/auth/register',
        { username: username.trim(), email: email.trim(), password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSuccess('✅ Εγγραφή επιτυχής! Μπορείς τώρα να συνδεθείς.');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      // Καθαρισμός success σε περίπτωση σφάλματος
      setSuccess('');
      const body = err.response?.data;
      setError(body?.error || body?.message || 'Σφάλμα κατά την εγγραφή.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label>Όνομα Χρήστη:</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@mail.com"
        />

        <label>Κωδικός:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button
         type="submit"
          style={{
            display: 'block',
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Εγγραφη..' : 'Εγγραφη'}
        </button>
      </form>

      {error && <p style={{ color: '#e06c75', marginTop: '0.5rem' }}>{error}</p>}
      {success && <p style={{ color: '#98c379', marginTop: '0.5rem' }}>{success}</p>}
    </div>
  );
};

export default RegisterForm;
