import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import useMeetingsStore from "../store/useMeetingsStore";
import useAuthStore from '../store/useAuthStore.jsx';
import { useNavigate } from 'react-router-dom';
import { formatDuration, formatParticipants, formatDate } from '../utils/formatMeeting.js';

function History() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    meetings,
    fetchMeetings,
    loading,
    error,
  } = useMeetingsStore();

  // Charger les réunions au montage
  useEffect(() => {
    if (user) {
      fetchMeetings();
    }
  }, [user, fetchMeetings]);

  if (!user) return <p>Vous n'êtes pas connecté.</p>;

  return (
    <div>
      <Navbar />
      <main>
        <section style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Historique complet des réunions</h2>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ← Retour au tableau de bord
            </button>
          </div>

          {loading && <p style={{ color: '#0066cc', padding: '10px', backgroundColor: '#e6f2ff', borderRadius: '4px', marginBottom: '20px' }}>Chargement des réunions...</p>}
          {error && <p style={{ color: 'red', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px', marginBottom: '20px' }}>❌ {error}</p>}

          {meetings.length === 0 ? (
            <p style={{ color: '#666', fontSize: '16px', textAlign: 'center', marginTop: '40px' }}>Aucune réunion passée</p>
          ) : (
            <div>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Total: <strong>{meetings.length} réunion{meetings.length > 1 ? 's' : ''}</strong>
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {meetings.map((meeting) => (
                  <li key={meeting._id} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px', borderLeft: '4px solid #007bff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>{meeting.title}</h4>
                        <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                          📅 {formatDate(meeting.date)}
                        </p>
                        <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                          ⏱️ Durée: <strong>{formatDuration(meeting.duration)}</strong>
                        </p>
                        <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                          👥 Participants: {formatParticipants(meeting.participants)}
                        </p>
                        <p style={{ margin: '5px 0', color: '#999', fontSize: '13px' }}>
                          📁 Groupe: <strong>{meeting.groupId ? meeting.groupId.name : 'Groupe non nommé'}</strong>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default History;