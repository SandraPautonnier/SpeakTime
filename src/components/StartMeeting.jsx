import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Dropdown from './Dropdown';
import MembersList from './MembersList';

export default function StartMeeting({ groups = [], isConnected = false }) {
  const [members, setMembers] = useState([]);
  const [duration, setDuration] = useState("00:00");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [durationMode, setDurationMode] = useState("total"); // "total" ou "until"
  const [untilTime, setUntilTime] = useState("");
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const navigate = useNavigate();

  // Initialiser l'heure actuelle une seule fois quand on change de mode
  useEffect(() => {
    if (durationMode === "until" && isConnected && !untilTime) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setUntilTime(`${hours}:${minutes}`);
    }
  }, [durationMode, isConnected, untilTime]);

  // Calculer le temps total à partir de "jusqu'à heure"
  useEffect(() => {
    if (durationMode === "until" && isConnected) {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      const [untilHours, untilMinutes] = untilTime.split(":").map(Number);
      const untilTotalMinutes = untilHours * 60 + untilMinutes;

      let diffMinutes = untilTotalMinutes - currentTotalMinutes;
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Si l'heure est demain
      }

      setCalculatedTotal(diffMinutes * 60); // Convertir en secondes
    }
  }, [untilTime, durationMode, isConnected]);

  const handleSelectGroup = (groupId) => {
    if (!groupId) {
      setMembers([]);
      setSelectedGroupId("");
      return;
    }

    const group = groups.find(g => g._id === groupId);
    if (group && group.members) {
      setMembers([...group.members]);
      setSelectedGroupId(groupId);
    }
  };

  // Ajouter un participant venant de MembersList
  const handleAddMember = (value) => {
    // Ajouter seulement les participants non-vides
    if (typeof value === 'string' && value.trim() !== "") {
      setMembers((prev) => [...prev, value.trim()]);
    }
  };

  const handleRemoveMember = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const handleStart = () => {
    const totalSeconds = durationMode === "total" 
      ? (() => {
          const [hours, minutes] = duration.split(":").map(Number);
          return (hours * 3600) + (minutes * 60);
        })()
      : calculatedTotal;

    const hasNonEmptyMember = members.some(m => typeof m === 'string' && m.trim() !== '');
    if (totalSeconds > 0 && hasNonEmptyMember) {
      navigate("/meeting", {
        state: { 
          members, 
          totalSeconds, 
          groupId: selectedGroupId || null,
          durationMode,
          endTime: durationMode === "until" ? untilTime : null
        },
      });
    } else {
      alert("Ajoute au moins un membre et une durée de réunion !");
    }
  };

  // Afficher le temps total calculé
  const formatSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}min`;
  };

  return (
    <section>
      <h2>Prêt-e à lancer votre réunion ?</h2>
      <div className="container static-component">
        {/* Mode de durée - uniquement pour utilisateurs connectés */}
        {isConnected && (
          <div className="form-group">
            <label>Mode de durée :</label>
            <div className="duration-mode-buttons">
              <button
                onClick={() => setDurationMode("total")}
                className={durationMode === "total" ? "active" : ""}
              >
                ⏱️ Durée totale
              </button>
              <button
                onClick={() => setDurationMode("until")}
                className={durationMode === "until" ? "active" : ""}
              >
                🕐 Jusqu'à heure
              </button>
            </div>
          </div>
        )}

        {/* Durée totale */}
        {durationMode === "total" && (
          <div className="form-group">
            <label>Durée totale :</label>
            <input
              type="time"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              step="60"
              placeholder="hh:mm"
              required
            />
          </div>
        )}

        {/* Jusqu'à heure - uniquement pour connectés */}
        {durationMode === "until" && isConnected && (
          <div className="form-group">
            <label>La réunion dure jusqu'à :</label>
            <div className="until-time-container">
              <input
                type="time"
                value={untilTime}
                onChange={e => setUntilTime(e.target.value)}
                placeholder={untilTime}
                required
              />
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className="arrow-icon"
              />
              <div className="duration-display">
                {formatSeconds(calculatedTotal)}
              </div>
            </div>
          </div>
        )}

        {isConnected && groups.length > 0 && (
          <div className="form-group">
            <label>Ajouter un groupe :</label>
            <Dropdown
              title="-- Sélectionner un groupe --"
              options={[
                { value: '', label: '-- Sélectionner un groupe --' },
                ...groups.map((group) => ({
                  value: group._id,
                  label: `${group.name} (${group.members?.length || 0} participant${group.members?.length > 1 ? 's' : ''})`
                }))
              ]}
              selectedValue={selectedGroupId}
              onSelect={(value) => handleSelectGroup(value)}
            />
          </div>
        )}

        <MembersList 
          members={members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          isConnected={isConnected}
          maxMembers={isConnected ? Infinity : 10} // Quand on n'est pas connecté, limiter à 10 participants
        />
      </div>
      <button className="btn-main" onClick={handleStart}>
        C'est parti !
      </button>
    </section>
  );
}
