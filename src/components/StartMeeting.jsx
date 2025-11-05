import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faClock } from '@fortawesome/free-solid-svg-icons';

export default function StartMeeting({ groups = [], isConnected = false }) {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [duration, setDuration] = useState("00:00");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const navigate = useNavigate();

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
    const [hours, minutes] = duration.split(":").map(Number);
    const totalSeconds = (hours * 3600) + (minutes * 60);
    if (totalSeconds > 0 && members.length > 0) {
      navigate("/meeting", {
        state: { members, totalSeconds, groupId: selectedGroupId || null },
      });
    } else {
      alert("Ajoute au moins un membre et une durée de réunion !");
    }
  };

  return (
    <section>
      <h2>Prêt-e à lancer votre réunion ?</h2>
      <div className="container">
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

        {isConnected && groups.length > 0 && (
          <div className="form-group">
            <label>Ajouter un groupe :</label>
            <select
              value={selectedGroupId}
              onChange={(e) => handleSelectGroup(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
                backgroundColor: "white",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif"
              }}
            >
              <option value="">-- Sélectionner un groupe --</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name} ({group.members?.length || 0} participant{group.members?.length > 1 ? 's' : ''})
                </option>
              ))}
            </select>
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
