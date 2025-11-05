import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import useGroupsStore from '../store/useGroupsStore.jsx';
import useAuthStore from '../store/useAuthStore.jsx';

function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', description: '' });
  const [memberInput, setMemberInput] = useState('');

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

  const handleAddMember = async () => {
    if (memberInput.trim()) {
      await addGroupMembers(id, [memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleRemoveMember = async (memberName) => {
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
      <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ marginBottom: '20px', backgroundColor: '#6c757d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Retour aux groupes
        </button>

        {error && <p style={{ color: 'red', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px', marginBottom: '20px' }}>{error}</p>}
        {success && <p style={{ color: 'green', padding: '10px', backgroundColor: '#e0ffe0', borderRadius: '4px', marginBottom: '20px' }}>{success}</p>}

        {/* Section Infos Groupe */}
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>{selectedGroup.name}</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {editMode ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {editMode ? (
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Nom du groupe</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
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
                <p style={{ fontSize: '0.85em', color: '#666' }}>
                  {editData.description.length}/250 caractères
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  style={{ flex: 1, backgroundColor: '#007bff', color: 'white', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: '#666', marginBottom: '10px' }}>{selectedGroup.description || 'Aucune description'}</p>
            </div>
          )}
        </div>

        {/* Section Participants */}
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <h3>Participants ({selectedGroup.members?.length || 0})</h3>

          {selectedGroup.members && selectedGroup.members.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
              {selectedGroup.members.map((member) => (
                <li
                  key={`${id}-${member}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    backgroundColor: 'white',
                    padding: '12px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                >
                  <span>{member}</span>
                  <button
                    onClick={() => handleRemoveMember(member)}
                    disabled={loading}
                    style={{ backgroundColor: '#dc3545', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666', marginBottom: '20px' }}>Aucun participant pour le moment</p>
          )}

          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', border: '1px solid #ddd' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Ajouter un participant</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && memberInput.trim()) {
                    handleAddMember();
                  }
                }}
                placeholder="Nom du participant"
                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <button
                onClick={handleAddMember}
                disabled={!memberInput.trim() || loading}
                style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Bouton Supprimer */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            onClick={handleDeleteGroup}
            disabled={loading}
            style={{ backgroundColor: '#dc3545', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
          >
            Supprimer le groupe
          </button>
        </div>

        {/* Bouton Retour */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#6c757d', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
          >
            ← Retour aux groupes
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default GroupDetail;
