// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPeopleGroup, faClock } from '@fortawesome/free-solid-svg-icons';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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
      <Navbar />
      <main>
        <section className="introduction">
          <h2>Gérez le temps de parole de vos réunions en toute simplicité</h2>
          <p>Avec SpeakTime, donnez à chacun la parole équitablement. Fixez la durée, ajoutez vos participants, et laissez l’application répartir le temps de parole automatiquement.</p>
          <div className="options-container">
            <div className="option">
              <FontAwesomeIcon className="icon" icon={faClock} />
              <h3>Commencez directement</h3>
              <p>Lancer votre première réunion sans créer de compte. Parfait pour tester SpeakTime !</p>
              <Link className="btn-main" to="/">Démarrer sans compte</Link>
            </div>
            <div className="option">
              <FontAwesomeIcon className="icon" icon={faPeopleGroup} />
              <h3>Créez un compte</h3>
              <p>Créez des groupes, nommez les et ajoutez des participants. Retrouvez un historique du temps de parole de vos réunions.</p>
              <Link className="btn-main"to="/register">Créer un compte</Link>
            </div>
          </div>
        </section>
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
            C’est parti !
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
