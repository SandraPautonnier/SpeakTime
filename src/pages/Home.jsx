// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const navigate = useNavigate();

  const handleAddMember = () => {
    if (newMember.trim() !== "") {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const handleStart = () => {
    const totalSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60);
    if (totalSeconds > 0 && members.length > 0) {
      navigate("/meeting", {
        state: { members, totalSeconds },
      });
    } else {
      alert("Ajoute au moins un membre et un temps de réunion !");
    }
  };

  return (
    <div className="home">
      <h1>🕒 SpeakTalk</h1>
      <div>
        <label>Durée de la réunion :</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="number"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Heures"
          />
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="Minutes"
          />
        </div>
      </div>

      <div>
        <label>Ajouter un membre :</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Nom du membre"
          />
          <button onClick={handleAddMember}>Ajouter</button>
        </div>

        <ul>
          {members.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <button onClick={handleStart} style={{ marginTop: "20px" }}>
        🚀 C’est parti !
      </button>
    </div>
  );
}
