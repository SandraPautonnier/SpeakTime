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
      <main>
        <h2>Créer un nouveau groupe</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom du groupe *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Réunion Marketing"
              />
            </div>

            <div className="form-group">
              <label>Description du groupe</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 250) })}
                maxLength="250"
                placeholder="Décrivez le groupe et son objectif"
              />
              <p className="char-count">
                {formData.description.length}/250 caractères <br />
                *Champ obligatoire
              </p>
            </div>

            <div className="button-group">
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="btn-primary"
              >
                {loading ? 'Création...' : 'Créer le groupe'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CreateGroup;
