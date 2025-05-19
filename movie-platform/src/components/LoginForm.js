// src/components/LoginForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();  // ← import του hook εδώ

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Συμπλήρωσε email και κωδικό.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Σφάλμα σύνδεσης");

      localStorage.setItem("token", data.token);
      // Ενημέρωση App.js
      onLoginSuccess && onLoginSuccess();
      // Redirect στο dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
        />
        <label>Κωδικός:</label>
        <input
          type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Συνδεση..." : "Συνδεση"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
