import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import useGroupsStore from '../store/useGroupsStore.jsx';
import useAuthStore from '../store/useAuthStore.jsx';

function CreateGroup() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { createGroup, loading, error, success } = useGroupsStore();

  if (!user) return <p>Vous n'êtes pas connecté.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGroup = await createGroup(formData);
    if (newGroup) {
      navigate(`/group/${newGroup._id}`);
    }
  };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        <h2>Créer un nouveau groupe</h2>

        {error && <p style={{ color: 'red', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>{error}</p>}
        {success && <p style={{ color: 'green', padding: '10px', backgroundColor: '#e0ffe0', borderRadius: '4px' }}>{success}</p>}

        <form onSubmit={handleSubmit} style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nom du groupe *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ex: Réunion Marketing"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 250) })}
              maxLength="250"
              placeholder="Décrivez le groupe et son objectif"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' }}
            />
            <p style={{ fontSize: '0.85em', color: '#666' }}>
              {formData.description.length}/250 caractères
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              style={{ flex: 1, backgroundColor: '#007bff', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
            >
              {loading ? 'Création...' : 'Créer le groupe'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{ flex: 1, backgroundColor: '#6c757d', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
            >
              Annuler
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default CreateGroup;
