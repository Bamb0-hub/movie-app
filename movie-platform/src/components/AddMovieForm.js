import React, { useState } from 'react';
import axios from 'axios';

const AddMovieForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: '',
    type: 'movie'
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/movies/add', formData);
      setSuccess(true);
      setFormData({
        title: '',
        genre: '',
        releaseYear: '',
        type: 'movie'
      });
    } catch (err) {
      console.error('❌ Error adding movie:', err);
    }
  };

  return (
    <div>
      {success && <p style={{ color: 'green' }}>✅ Καταχωρήθηκε με επιτυχία!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Τίτλος:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Είδος:</label>
          <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />
        </div>
        <div>
          <label>Έτος:</label>
          <input type="number" name="releaseYear" value={formData.releaseYear} onChange={handleChange} required />
        </div>
        <div>
          <label>Τύπος:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="movie">Ταινία</option>
            <option value="series">Σειρά</option>
          </select>
        </div>
        <button type="submit">Καταχώρηση</button>
      </form>
    </div>
  );
};

export default AddMovieForm;
