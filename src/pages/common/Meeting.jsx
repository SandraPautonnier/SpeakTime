// src/pages/Meeting.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useMeetingsStore from "../../store/useMeetingsStore";
import Navbar from "../../components/Navbar";

export default function Meeting() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { createMeeting } = useMeetingsStore();

  const members = (state && state.members) || [];
  const totalSeconds = (state && state.totalSeconds) || 0;
  const groupId = (state && state.groupId) || null;
  const durationMode = (state && state.durationMode) || "total";
  const endTime = (state && state.endTime) || null;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [displayEndTime, setDisplayEndTime] = useState(
    durationMode === "until" ? endTime : null
  );
  const intervalRef = useRef(null);

  const [speakers, setSpeakers] = useState(() =>
    members.map((name) => ({
      name,
      time: 0,
      isSpeaking: false,
      hasSpoken: false, // devient true uniquement quand la personne atteint ou dépasse son temps initial
    }))
  );

  // redirection sécurité si données manquantes
  useEffect(() => {
    if (!members.length || !totalSeconds) {
      navigate("/");
    }
  }, [members, totalSeconds, navigate]);

  const initialPerMember =
    members.length > 0 ? totalSeconds / members.length : 0;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Calculer l'heure de fin de la réunion (se met à jour chaque seconde si mode "total")
  useEffect(() => {
    if (durationMode === "total") {
      const now = new Date();
      const endTimeObj = new Date(now.getTime() + timeLeft * 1000);
      const hours = String(endTimeObj.getHours()).padStart(2, "0");
      const minutes = String(endTimeObj.getMinutes()).padStart(2, "0");
      setDisplayEndTime(`${hours}:${minutes}`);
    }
  }, [timeLeft, durationMode]);

  // Gestion du timer global - démarre automatiquement
  useEffect(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => Math.max(0, t - 1));

        setSpeakers((prev) =>
          prev.map((p) => {
            if (p.isSpeaking) {
              const newTime = p.time + 1;
              const hasSpoken = newTime >= initialPerMember; // ✅ devient true seulement s'il a atteint ou dépassé son temps
              return { ...p, time: newTime, hasSpoken };
            }
            return p;
          })
        );
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [initialPerMember]);

  // Fin de réunion
  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Créer le meeting avec les données collectées (avec temps de parole)
      const meetingData = {
        groupId: groupId || null,
        participants: speakers.map((s) => ({
          name: s.name,
          speakingTime: s.time,
        })),
        duration: totalSeconds,
      };

      // Créer le meeting et rediriger
      createMeeting(meetingData).then(() => {
        navigate("/summary", { state: { memberTimes: speakers, totalSeconds } });
      });
    }
  }, [timeLeft, speakers, totalSeconds, navigate, createMeeting, groupId]);

  // Gestion du bouton "Parle"
  const toggleSpeaking = (index) => {
    setSpeakers((prev) =>
      prev.map((p, i) => ({
        ...p,
        isSpeaking: i === index ? !p.isSpeaking : false,
      }))
    );
  };

  // Réordonner les participants
  const moveParticipant = (index, direction) => {
    setSpeakers((prev) => {
      const newSpeakers = [...prev];
      if (direction === "up" && index > 0) {
        [newSpeakers[index], newSpeakers[index - 1]] = [newSpeakers[index - 1], newSpeakers[index]];
      } else if (direction === "down" && index < newSpeakers.length - 1) {
        [newSpeakers[index], newSpeakers[index + 1]] = [newSpeakers[index + 1], newSpeakers[index]];
      }
      return newSpeakers;
    });
  };

  // === CALCUL ALLOCATION DYNAMIQUE ===
  const sumSpokenByHasSpoken = speakers
    .filter((s) => s.hasSpoken)
    .reduce((acc, s) => acc + s.time, 0);

  const notYetSpokenCount = speakers.filter((s) => !s.hasSpoken).length;

  const allocationForNotYetSpoken =
    notYetSpokenCount > 0
      ? Math.max(
          0,
          Math.floor((totalSeconds - sumSpokenByHasSpoken) / notYetSpokenCount)
        )
      : 0;

  const totalSpoken = speakers.reduce((acc, s) => acc + s.time, 0);
  const globalOvertime = Math.max(0, totalSpoken - totalSeconds);

  return (
    <div className="meeting">
      <Navbar />
      <main>
        <section>
          <div className="meeting-header">
            <div>
              <h2>Réunion en cours ...</h2>
              <div className="header-info">
                <p className="time-item">
                  Temps total restant : <strong>{formatTime(timeLeft)}</strong>
                </p>
                <p className="time-item">
                  Jusqu'à : <strong>{displayEndTime}</strong>
                </p>
                {globalOvertime > 0 && (
                  <p className="overtime">
                    ⚠️ Dépassement global : {formatTime(globalOvertime)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="speakers-grid">
            {speakers.map((s, i) => {
              const isNotYetSpoken = !s.hasSpoken;
              const allocation =
                isNotYetSpoken && sumSpokenByHasSpoken === 0
                  ? Math.floor(initialPerMember)
                  : isNotYetSpoken
                  ? allocationForNotYetSpoken
                  : Math.floor(initialPerMember);

              const over = s.time > initialPerMember;

              // Déterminer la classe de couleur de la carte
              let cardColorClass = "card-component";
              if (s.isSpeaking || (!s.hasSpoken && s.time <= initialPerMember * 0.8)) {
                // En train de parler ou a utilisé jusqu'à 80%
                cardColorClass = "card-component time-under-eighty";
              } else if (s.time >= initialPerMember * 0.8 && s.time < initialPerMember) {
                // A utilisé entre 80 et 100% de son temps (et pas encore dépassé)
                cardColorClass = "card-component time-eighty-to-hundred";
              } else if (over) {
                // A dépassé son temps
                cardColorClass = "card-component time-exceeded";
              }

              return (
                <div
                  key={i}
                  className={cardColorClass}
                >
                  <div className="card-header">
                    <div className="speaker-name">
                      <p><strong>{s.name}</strong></p>
                      <div className="reorder-buttons">
                        <button
                          onClick={() => moveParticipant(i, "up")}
                          disabled={i === 0}
                          title="Monter"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveParticipant(i, "down")}
                          disabled={i === speakers.length - 1}
                          title="Descendre"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSpeaking(i)}
                      className={`speak-button ${s.isSpeaking ? "speaking" : "not-speaking"}`}
                    >
                      {s.isSpeaking ? "Stop" : "Parle"}
                    </button>
                  </div>

                  <div className="card-content">
                    <p className={`speaking-info ${over ? "overtime" : ""}`}>
                      Déjà parlé : <strong>{formatTime(s.time)}</strong>
                    </p>

                    <p className="speaking-info">
                      Temps de parole alloué : 
                      <strong>{formatTime(allocation)}</strong>
                    </p>

                    {over && (
                      <p className="overtime-alert">
                        🚨 A dépassé de{" "}
                         {formatTime(Math.floor(s.time - initialPerMember))}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
