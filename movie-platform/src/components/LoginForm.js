// src/components/LoginForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLoginSuccess = () => {} }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Έλεγχος εγκυρότητας email με regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Έλεγχος υποχρεωτικών πεδίων
    if (email.trim() === "" || password.trim() === "") {
      setError("Παρακαλώ συμπλήρωσε όλα τα υποχρεωτικά πεδία.");
      return;
    }

    // Έλεγχος μορφής email
    if (!validateEmail(email.trim())) {
      setError("Παρακαλώ εισάγετε έγκυρο email.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Σφάλμα κατά τη σύνδεση.");

      setSuccess("✅ Επιτυχής σύνδεση!");
      localStorage.setItem("token", data.token);
      onLoginSuccess(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Κωδικός:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
          />
        </div>

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
          {loading ? "Συνδεση..." : "Συνδεση"}
        </button>

        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>{success}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
