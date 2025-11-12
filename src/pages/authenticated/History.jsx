import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import MeetingItem from '../../components/MeetingItem.jsx';
import useMeetingsStore from "../../store/useMeetingsStore.jsx";
import useAuthStore from '../../store/useAuthStore.jsx';
import { useNavigate } from 'react-router-dom';
import { formatDuration, formatParticipants, formatDate, generateMeetingTitleWithGroup } from '../../utils/formatMeeting.js';

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
        <section className="history-container">
          <div className="container-header">
            <button
              onClick={() => navigate('/dashboard')}
              className='btn-secondary'
            >
              ← Retour au tableau de bord
            </button>
            <h2>Historique complet des réunions</h2>
            
          </div>

          {loading && <p className="loading-message">Chargement des réunions...</p>}
          {error && <p className="error-message">❌ {error}</p>}

          {meetings.length === 0 ? (
            <p className="empty-message">Aucune réunion passée</p>
          ) : (
            <div>
              <p className="total-count">
                Total: <strong>{meetings.length} réunion{meetings.length > 1 ? 's' : ''}</strong>
              </p>
              <ul className="meetings-list">
                {meetings.map((meeting) => (
                  <MeetingItem key={meeting._id} meeting={meeting} />
                ))}
              </ul>
              <div className="footer-button-container">
                <button
                  onClick={() => navigate('/dashboard')}
                  className='btn-secondary'
                >
                  ← Retour au tableau de bord
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default History;