import React, { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import StartMeeting from '../components/StartMeeting.jsx';
import useGroupsStore from "../store/useGroupsStore";
import useMeetingsStore from "../store/useMeetingsStore";
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore.jsx';
import { formatDuration, formatParticipants, formatDate } from '../utils/formatMeeting.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    groups,
    fetchGroups,
    loading,
    error,
  } = useGroupsStore();

  const {
    meetings,
    fetchMeetings,
  } = useMeetingsStore();

  // Charger les groupes et réunions au montage
  useEffect(() => {
    if (user) {
      fetchGroups();
      fetchMeetings();
    }
  }, [user, fetchGroups, fetchMeetings]);

  // Générer le titre automatique de la réunion avec le nom du groupe
  const generateMeetingTitleWithGroup = (meeting) => {
    const groupName = meeting.groupId?.name;
    const date = new Date(meeting.date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('fr-FR', options);
    
    if (groupName) {
      return `Réunion ${groupName} du ${formattedDate}`;
    } else {
      return `Réunion du ${formattedDate}`;
    }
  };

  if (!user) return <p>Vous n'êtes pas connecté.</p>;

  return (
    <div>
      <Navbar />
      <main>
        <section>
          <div>
            <h2>Bienvenue {user.username}!</h2>
          </div>

          {loading && <p>Chargement des données...</p>}
          {error && <p>❌ {error}</p>}
        </section>

        <StartMeeting isConnected={true} groups={groups} />

        <section className="groups-section">
          <h2>Mes groupes</h2>
          <button
            onClick={() => navigate('/create-group')}
            className='btn-secondary'>
            <FontAwesomeIcon icon={faPlus} /> Créer un groupe
          </button>
          {groups.length === 0 ? (
            <p className="empty-group-message">Aucun groupe pour le moment. Créez votre premier groupe !</p>
          ) : (
            <div className="groups-grid">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="group-card"
                  onClick={() => navigate(`/group/${group._id}`)}
                >
                  <h4>{group.name}</h4>
                  <p>{group.description || 'Pas de description'}</p>
                  <p>
                    <strong>{group.members?.length || 0}</strong> participant{group.members?.length > 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="meetings-section">
          <div className="section-header">
            <h3>Réunions récentes</h3>
          </div>
          {meetings.length === 0 ? (
            <p className="empty-meetings-message">Aucune réunion passée</p>
          ) : (
            <>
              <ul>
                {meetings.slice(0, 3).map((meeting) => (
                  <li key={meeting._id}>
                    <div className="meeting-container">
                      <div className="meeting-info">
                        <h4>{generateMeetingTitleWithGroup(meeting)}</h4>
                        <p>
                          📅 {formatDate(meeting.date)}
                        </p>
                        <p>
                          ⏱️ Durée: <strong>{formatDuration(meeting.duration)}</strong>
                        </p>
                        <p>
                          👥 Participants: {formatParticipants(meeting.participants)}
                        </p>
                        <p>
                          📁 Groupe: <strong>{meeting.groupId ? meeting.groupId.name : 'Groupe non nommé'}</strong>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {meetings.length > 3 && (
                <button 
                  onClick={() => navigate('/history')}
                  className='btn-secondary'>
                  Voir plus <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard