import React, { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import useDashboardStore from "../store/useDashboardStore";
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore.jsx';
import useUsersStore from '../store/useUsersStore.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getUserById } = useUsersStore();

  const {
  
    groups,
    meetings,
    fetchGroups,
    fetchMeetings,
    loading,
    error,
  } = useDashboardStore();

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
        <section>
          <div className='dashboard-container'>
            <h2>Bienvenue, {user.username}!</h2>
            {/* Contenu du tableau de bord */}
          </div>
        </section>
              <section>
        <h2>Mes groupes</h2>
        {groups.length === 0 ? (
          <p>Aucun groupe trouvé</p>
        ) : (
          <ul>
            {groups.map((g) => (
              <li key={g._id}>{g.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Historique des réunions</h2>
        {meetings.length === 0 ? (
          <p>Aucune réunion passée</p>
        ) : (
          <ul>
            {meetings.map((m) => (
              <li key={m._id}>
                {m.title} - {new Date(m.date).toLocaleString()}
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