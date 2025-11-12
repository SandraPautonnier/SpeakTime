import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import MembersList from '../../components/MembersList.jsx';
import useGroupsStore from '../../store/useGroupsStore.jsx';
import useAuthStore from '../../store/useAuthStore.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', description: '' });

  const {
    getGroupById,
    updateGroupName,
    updateGroupDescription,
    addGroupMembers,
    removeGroupMembers,
    deleteGroup,
    selectedGroup,
    loading,
    error,
    success,
  } = useGroupsStore();

  useEffect(() => {
    if (id) {
      getGroupById(id);
    }
  }, [id]);

  useEffect(() => {
    if (selectedGroup) {
      setEditData({ name: selectedGroup.name, description: selectedGroup.description });
    }
  }, [selectedGroup]);

  // Redirection si accès non-autorisé (403)
  useEffect(() => {
    if (error && (error.includes("non autorisé") || error.includes("Accès non"))) {
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  }, [error, navigate]);

  if (!user) return <p>Vous n'êtes pas connecté.</p>;
  if (loading && !selectedGroup) return <p>Chargement...</p>;
  if (error && (error.includes("non autorisé") || error.includes("Accès non"))) {
    return (
      <div>
        <Navbar />
        <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
          <p style={{ color: 'red', fontSize: '18px' }}>⚠️ {error}</p>
          <p style={{ color: '#666' }}>Redirection vers le Dashboard dans 2 secondes...</p>
        </main>
        <Footer />
      </div>
    );
  }
  if (!selectedGroup) return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <p>Groupe non trouvé.</p>
        <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Retour au Dashboard
        </button>
      </main>
      <Footer />
    </div>
  );

  const handleUpdate = async () => {
    let updated = false;
    if (editData.name.trim() !== selectedGroup.name) {
      await updateGroupName(id, editData.name);
      updated = true;
    }
    if (editData.description !== selectedGroup.description) {
      await updateGroupDescription(id, editData.description);
      updated = true;
    }
    if (updated) {
      setEditMode(false);
    }
  };

  const handleAddMember = async (memberName) => {
    await addGroupMembers(id, [memberName]);
  };

  const handleRemoveMember = async (index) => {
    const memberName = selectedGroup.members[index];
    if (window.confirm(`Retirer ${memberName} du groupe ?`)) {
      await removeGroupMembers(id, [memberName]);
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.')) {
      const success = await deleteGroup(id);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <main>
        <section>
          <div className='container-header'>
            <button
              onClick={() => navigate('/dashboard')} className='btn-secondary'
            >
              ← Retour au tableau de bord
            </button>
            <h2>Modification du groupe</h2>
          </div>
          

          {error && <p>{error}</p>}
          {success && <p>{success}</p>}

          {/* Section Infos Groupe */}
          <div>
            <div className='group-between'>
              <h3>{selectedGroup.name}</h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className='btn-secondary'
              >
                <FontAwesomeIcon icon={faPencil} /> Modifier
              </button>
            </div>

            {editMode ? (
              <div>
                <div className='form-group'>
                  <label>Nom du groupe</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value.slice(0, 250) })}
                    maxLength="250"
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '80px' }}
                  />
                  <p className='info-description'>
                    {editData.description.length}/250 caractères
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className='btn-main'
                  >
                    Mettre à jour
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>{selectedGroup.description || 'Aucune description'}</p>
              </div>
            )}
          </div>

          {/* Section Participants */}
          <div className='container'>
            <h3>Participants ({selectedGroup.members?.length || 0})</h3>
            <MembersList 
              members={selectedGroup.members}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              loading={loading}
            />
          </div>

          {/* Bouton Supprimer */}
          <div>
            <button
              onClick={handleDeleteGroup}
              disabled={loading}
            >
              Supprimer le groupe
            </button>
          </div>

          {/* Bouton Retour */}
          <div>
            <button
              onClick={() => navigate('/dashboard')} className='btn-secondary'
            >
              ← Retour au tableau de bord
            </button>
          </div>
        </section>
        
      </main>
      <Footer />
    </div>
  );
}

export default GroupDetail;
