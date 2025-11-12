// src/pages/Meeting.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Navbar";
import useMeetingsStore from "../../store/useMeetingsStore";

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
    <div className="meeting" style={{ padding: 20 }}>
      <Header />
      <main>
        <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <h2>Réunion en cours ...</h2>
            <div style={{ marginTop: 6 }}>
              Temps total restant : <strong>{formatTime(timeLeft)}</strong>
            </div>
            <div style={{ marginTop: 6, fontSize: 14, color: "#666" }}>
              Jusqu'à : <strong>{displayEndTime}</strong>
            </div>
            {globalOvertime > 0 && (
              <div style={{ color: "red", marginTop: 6 }}>
                ⚠️ Dépassement global : {formatTime(globalOvertime)}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {speakers.map((s, i) => {
            const isNotYetSpoken = !s.hasSpoken;
            const allocation =
              isNotYetSpoken && sumSpokenByHasSpoken === 0
                ? Math.floor(initialPerMember)
                : isNotYetSpoken
                ? allocationForNotYetSpoken
                : Math.floor(initialPerMember);

            const over = s.time > initialPerMember;

            return (
              <div
                key={i}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #eee",
                  background: s.isSpeaking ? "#eef6ff" : "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <strong>{s.name}</strong>
                    <div style={{ display: "flex", gap: "2px" }}>
                      <button
                        onClick={() => moveParticipant(i, "up")}
                        disabled={i === 0}
                        style={{
                          padding: "4px 6px",
                          borderRadius: 4,
                          border: "1px solid #ccc",
                          cursor: i === 0 ? "not-allowed" : "pointer",
                          background: i === 0 ? "#f0f0f0" : "white",
                          opacity: i === 0 ? 0.5 : 1,
                          fontSize: 12,
                        }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveParticipant(i, "down")}
                        disabled={i === speakers.length - 1}
                        style={{
                          padding: "4px 6px",
                          borderRadius: 4,
                          border: "1px solid #ccc",
                          cursor: i === speakers.length - 1 ? "not-allowed" : "pointer",
                          background: i === speakers.length - 1 ? "#f0f0f0" : "white",
                          opacity: i === speakers.length - 1 ? 0.5 : 1,
                          fontSize: 12,
                        }}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSpeaking(i)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: s.isSpeaking ? "#e53e3e" : "#3182ce",
                      color: "white",
                    }}
                  >
                    {s.isSpeaking ? "Stop" : "Parle"}
                  </button>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 13, color: over ? "red" : "#333" }}>
                    Déjà parlé : <strong>{formatTime(s.time)}</strong>
                    {s.hasSpoken && (
                      <span style={{ marginLeft: 8, fontSize: 12, color: "#555" }}>
                        (a utilisé son temps)
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
                    Temps de parole alloué :
                    <strong style={{ marginLeft: 8 }}>
                      {formatTime(allocation)}
                    </strong>
                  </div>

                  {over && (
                    <div
                      style={{ marginTop: 8, color: "red", fontWeight: 600 }}
                    >
                      🚨 A dépassé de{" "}
                      {formatTime(Math.floor(s.time - initialPerMember))}
                    </div>
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
