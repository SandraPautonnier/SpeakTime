import React, { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import useGroupsStore from "../store/useGroupsStore";
import useMeetingsStore from "../store/useMeetingsStore";
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore.jsx';

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
  }, [user]);

  if (!user) return <p>Vous n'êtes pas connecté.</p>;

  return (
    <div>
      <Navbar />
      <main>
        <section style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Bienvenue {user.username}!</h2>
            <button
              onClick={() => navigate('/create-group')}
              style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}
            >
              + Créer un groupe
            </button>
          </div>

          {error && <p style={{ color: 'red', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px', marginBottom: '20px' }}>{error}</p>}

          <h3 style={{ marginBottom: '20px' }}>Mes groupes</h3>
          {groups.length === 0 ? (
            <p style={{ color: '#666', fontSize: '16px' }}>Aucun groupe pour le moment. Créez votre premier groupe !</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {groups.map((group) => (
                <div
                  key={group._id}
                  onClick={() => navigate(`/group/${group._id}`)}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#007bff' }}>{group.name}</h4>
                  <p style={{ color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                    {group.description || 'Pas de description'}
                  </p>
                  <p style={{ color: '#999', fontSize: '14px' }}>
                    <strong>{group.members?.length || 0}</strong> participant{group.members?.length > 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
          <h3 style={{ marginBottom: '20px' }}>Historique des réunions</h3>
          {meetings.length === 0 ? (
            <p style={{ color: '#666', fontSize: '16px' }}>Aucune réunion passée</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {meetings.map((meeting) => (
                <li key={meeting._id} style={{ marginBottom: '10px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '4px', borderLeft: '4px solid #007bff' }}>
                  <strong>{meeting.title}</strong> - {new Date(meeting.date).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard