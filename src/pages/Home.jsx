// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup, faClock } from '@fortawesome/free-solid-svg-icons';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import StartMeeting from "../components/StartMeeting";

export default function Home() {
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
        <StartMeeting isConnected={false} />
      </main>
      <Footer />
    </div>
  );
}
