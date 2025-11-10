import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Dropdown from './Dropdown';

export default function StartMeeting({ groups = [], isConnected = false }) {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
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

  const handleAddMember = () => {
    if (newMember.trim() !== "") {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
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

    if (totalSeconds > 0 && members.length > 0) {
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
      <div className="container">
        {/* Mode de durée - uniquement pour utilisateurs connectés */}
        {isConnected && (
          <div className="form-group">
            <label>Mode de durée :</label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button
                onClick={() => setDurationMode("total")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: durationMode === "total" ? "2px solid #5664E3" : "1px solid #ccc",
                  backgroundColor: durationMode === "total" ? "#EEF1FF" : "white",
                  cursor: "pointer",
                  fontWeight: durationMode === "total" ? "600" : "400",
                  fontSize: "14px",
                  color: durationMode === "total" ? "#5664E3" : "#333"
                }}
              >
                ⏱️ Durée totale
              </button>
              <button
                onClick={() => setDurationMode("until")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: durationMode === "until" ? "2px solid #5664E3" : "1px solid #ccc",
                  backgroundColor: durationMode === "until" ? "#EEF1FF" : "white",
                  cursor: "pointer",
                  fontWeight: durationMode === "until" ? "600" : "400",
                  fontSize: "14px",
                  color: durationMode === "until" ? "#5664E3" : "#333"
                }}
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
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="time"
                value={untilTime}
                onChange={e => setUntilTime(e.target.value)}
                placeholder={untilTime}
                required
                style={{ flex: 1 }}
              />
              <FontAwesomeIcon 
                icon={faArrowRight} 
                style={{ color: "#5664E3", fontSize: "18px" }}
              />
              <div style={{ padding: "10px 15px", backgroundColor: "#EEF1FF", borderRadius: "4px", whiteSpace: "nowrap", fontSize: "14px", fontWeight: "600", fontFamily: "Montserrat, sans-serif", color: "#5664E3" }}>
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

        <div className="form-group">
          <label>Participants :</label>
          <div>
            {members.map((m, i) => (
              <div key={i} className="member-container">
                <span className="member-item">{m}</span>
                <button className="btn-add" onClick={() => handleRemoveMember(i)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
            <div className="container-add">
              <input
                type="text"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Nom/Prénom/Pseudo"
                onKeyDown={e => { if (e.key === "Enter") handleAddMember(); }}
              />
              <button className="btn-add" onClick={handleAddMember}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="btn-main" onClick={handleStart}>
        C'est parti !
      </button>
    </section>
  );
}
