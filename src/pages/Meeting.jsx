// src/pages/Meeting.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Navbar";
import useMeetingsStore from "../store/useMeetingsStore";

export default function Meeting() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { createMeeting } = useMeetingsStore();

  const members = (state && state.members) || [];
  const totalSeconds = (state && state.totalSeconds) || 0;
  const groupId = (state && state.groupId) || null;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
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

  // Gestion du timer global
  useEffect(() => {
    const someoneSpeaking = speakers.some((s) => s.isSpeaking);

    if (someoneSpeaking && !intervalRef.current) {
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

    if (!someoneSpeaking && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [speakers, initialPerMember]);

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
            {globalOvertime > 0 && (
              <div style={{ color: "red", marginTop: 6 }}>
                ⚠️ Dépassement global : {formatTime(globalOvertime)}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() =>
                setSpeakers((prev) =>
                  prev.map((p) => ({ ...p, isSpeaking: false }))
                )
              }
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ⏸ Pause
            </button>
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
                  }}
                >
                  <strong>{s.name}</strong>
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
      </main>
    </div>
  );
}
