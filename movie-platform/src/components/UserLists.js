import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserLists = () => {
  const [lists, setLists] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token  = localStorage.getItem('token');
        // decode token για userId 
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId  = payload.id;

        const res = await axios.get(
          `http://localhost:5000/api/lists/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLists(res.data);
      } catch (err) {
        setError('Δεν φορτώθηκαν οι λίστες');
      }
    };
    fetchLists();
  }, []);

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      {lists.length === 0 
        ? <p>Δεν έχεις δημιουργήσει λίστες ακόμα.</p>
        : lists.map(list => (
            <div key={list._id} className="card">
              <h4> {list.name} </h4>
              <ul>
                {list.movies.map(m => (
                  <li key={m._id}>{m.title} ({m.type})</li>
                ))}
              </ul>
            </div>
          ))
      }
    </div>
  );
};

export default UserLists;
