import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import StartMeeting from '../../components/StartMeeting.jsx';
import MeetingItem from '../../components/MeetingItem.jsx';
import GroupItem from '../../components/GroupItem.jsx';
import useGroupsStore from "../../store/useGroupsStore.jsx";
import useMeetingsStore from "../../store/useMeetingsStore.jsx";
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore.jsx';
import { formatDuration, formatParticipants, formatDate, generateMeetingTitleWithGroup } from '../../utils/formatMeeting.js';
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
            <p className="empty-message">Aucun groupe pour le moment. Créez votre premier groupe !</p>
          ) : (
            <div className="groups-grid">
              {groups.map((group) => (
                <GroupItem key={group._id} group={group} />
              ))}
            </div>
          )}
        </section>

        <section className="meetings-section">
          <div className="section-header">
            <h3>Réunions récentes</h3>
          </div>
          {meetings.length === 0 ? (
            <p className="empty-message">Aucune réunion passée</p>
          ) : (
            <>
              <ul>
                {meetings.slice(0, 3).map((meeting) => (
                  <MeetingItem key={meeting._id} meeting={meeting} />
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