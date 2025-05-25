// src/components/UserLists.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CreateListForm from './CreateListForm';

function UserLists() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);

  // Fetch και επανεμφάνιση λιστών
  const fetchLists = async () => {
    try {
      const res = await api.get('/lists/my');
      setLists(res.data);
      // Αν δεν υπάρχει επιλογή, επιλέγουμε την πρώτη
      if (res.data.length > 0 && !selectedListId) {
        setSelectedListId(res.data[0]._id);
      }
    } catch (err) {
      console.error('Load lists error:', err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchLists();
    // Όταν δημιουργείται νέα λίστα ή προστίθεται ταινία, ξαναφορτώνουμε dropdown
    window.addEventListener('listCreated', fetchLists);
    window.addEventListener('movieAddedToList', fetchLists);
    return () => {
      window.removeEventListener('listCreated', fetchLists);
      window.removeEventListener('movieAddedToList', fetchLists);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Callback για νέα λίστα
  const handleNewList = (newList) => {
    setLists(prev => [newList, ...prev]);
    setSelectedListId(newList._id);
  };

  const handleListClick = (id) => {
    setSelectedListId(id);
  };

  const selectedList = lists.find(l => l._id === selectedListId);

  return (
    <div>
      <h2>Δημιουργια Προσωπικης Λιστας</h2>
      <CreateListForm onCreated={handleNewList} />

      <h2>Οι Λιστες Μου</h2>
      {lists.length === 0 ? (
        <p>Δεν υπάρχουν λίστες ακόμη.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {lists.map(list => (
              <li
                key={list._id}
                onClick={() => handleListClick(list._id)}
                style={{
                  cursor: 'pointer',
                  fontWeight: list._id === selectedListId ? 'bold' : 'normal',
                  padding: '4px 0'
                }}
              >
                {list.name}
              </li>
            ))}
          </ul>

          {selectedList && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Ταινίες στη λίστα "{selectedList.name}"</h3>
              {selectedList.movies && selectedList.movies.length > 0 ? (
                <ul>
                  {selectedList.movies.map(movie => (
                    <li key={movie._id}>{movie.title}</li>
                  ))}
                </ul>
              ) : (
                <p>Δεν υπάρχουν ταινίες σε αυτή τη λίστα.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserLists;
