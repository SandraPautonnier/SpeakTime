// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


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
      <Header />
      <p>Bienvenue sur SpeakTime, une application qui permet de contrôler le temps total, pour prendre le temps pour chaque personne.</p>
      <main>
        <h2>Planifie ta réunion</h2>
      <div>
        <label>Combien de temps dure ta réunion ?</label>
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
        <label>Combien de personnes ? Et qui est présent ?</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Nom/Prénom/Pseudo"
          />
          <button className="btn-add" onClick={handleAddMember}><FontAwesomeIcon icon={faPlus} /></button>
        </div>

        <ul>
          {members.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <button className="btn-main" onClick={handleStart}>
        C’est parti !
      </button>
      </main>

    </div>
  );
}
