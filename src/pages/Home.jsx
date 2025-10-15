// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [duration, setDuration] = useState("00:00");
  const navigate = useNavigate();

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
        state: { members, totalSeconds },
      });
    } else {
      alert("Ajoute au moins un membre et une durée de réunion !");
    }
  };

  return (
    <div className="home">
      <Header />
      <p>Bienvenue sur SpeakTime, l’application qui vous aide à gérer le temps de parole pendant vos réunions !</p>
      <main>
        <section>
          <h2>Prêt-e à lancer la réunion ?</h2>
          <div className="container">
            <div className="container-input">
              <label>Durée totale :</label>
              <input
                type="time"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                step="60"
                required
              />
            </div>
            <div className="container-input">
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
            C’est parti !
          </button>
        </section>
      </main>

    </div>
  );
}
