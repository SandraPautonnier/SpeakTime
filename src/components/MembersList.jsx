import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function MembersList({ members, onAddMember, onRemoveMember, isConnected = true, maxMembers = Infinity, loading = false }) {
  // État pour l'input de création d'un nouveau participant
  const [newInput, setNewInput] = useState("");
  // Indique si un nouvel input a été créé (après avoir cliqué sur le bouton +)
  const [showNewInput, setShowNewInput] = useState(false);

  // Fonction appelée quand on clique sur le bouton "+"
  const handleCreateNewMember = () => {
    // Vérifier s'il y a une limite de participants
    if ((members?.length || 0) >= maxMembers) return;
    
    // Afficher toujours un nouvel input vide, peu importe le contenu
    setShowNewInput(true);
    setNewInput("");
  };

  // Fonction appelée quand on appuie sur "Entrée" ou clique sur "+" dans le nouvel input
  const handleSaveNewMember = () => {
    const value = newInput.trim();
    
    // Si le participant a un nom, l'ajouter à la liste
    if (value !== "") {
      onAddMember(value);
      setNewInput("");
      // Garder l'input visible pour continuer à en ajouter d'autres
      setShowNewInput(true);
    }
  };

  // Gérer la touche Entrée dans le nouvel input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveNewMember();
    }
  };

  // Annuler la création d'un nouveau participant (touche Echap)
  const handleCancel = () => {
    setShowNewInput(false);
    setNewInput("");
  };

  return (
    <div className="form-group">
      <label>Participants :</label>
      <div className="member-list">
        {/* Afficher la liste des participants déjà ajoutés */}
        {members.map((m, i) => (
          <div key={i} className="member-container">
            <span className="member-item">{m}</span>
            <button 
              className="btn-i-remove" 
              onClick={() => onRemoveMember(i)}
              disabled={loading}
              title="Supprimer"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
      </div>

      {/* Afficher l'input de création d'un nouveau participant si le bouton + a été cliqué */}
      {showNewInput && (
        <div className="container-add">
          <input
            type="text"
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            placeholder="Nom/Prénom/Pseudo"
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button 
            className="btn-i-add" 
            onClick={handleSaveNewMember}
            title="Ajouter"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}

      {/* Bouton "+" pour créer un nouvel input */}
      {!showNewInput && (
        <div className="container-add">
          <input
            type="text"
            placeholder="Ajouter un participant..."
            onKeyDown={handleKeyDown}
            onClick={() => setShowNewInput(true)}
            style={{ cursor: 'pointer' }}
          />
          <button 
            className="btn-i-add" 
            onClick={handleCreateNewMember}
            disabled={loading || (members?.length || 0) >= maxMembers}
            title="Ajouter un participant"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}
    </div>
  );
}
