// src/pages/Meeting.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Meeting() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // récupération depuis location.state (venu de la page Setup/Home)
  const members = (state && state.members) || [];
  const totalSeconds = (state && state.totalSeconds) || 0;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const intervalRef = useRef(null);

  // initialisation des participants
  const [speakers, setSpeakers] = useState(() =>
    members.map((name) => ({
      name,
      time: 0, // temps déjà parlé (s)
      isSpeaking: false,
      hasSpoken: false, // devient true dès qu'il/elle a parlé >=1s
    }))
  );

  // sécurité : si on arrive sans données -> back to home
  useEffect(() => {
    if (!members.length || !totalSeconds) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // valeur initiale par membre (en secondes)
  const initialPerMember = members.length > 0 ? totalSeconds / members.length : 0;

  // utilitaire format mm:ss
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Start global timer si au moins un isSpeaking === true
  useEffect(() => {
    const someoneSpeaking = speakers.some((s) => s.isSpeaking);
    if (someoneSpeaking && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => Math.max(0, t - 1));

        setSpeakers((prev) => {
          // on incrémente le temps du·de la qui parle
          const next = prev.map((p) => {
            if (p.isSpeaking) {
              return {
                ...p,
                time: p.time + 1,
                hasSpoken: true, // marque qu'il/elle a parlé
              };
            }
            return p;
          });
          return next;
        });
      }, 1000);
    }

    // Si plus personne ne parle, on stoppe l'interval
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
  }, [speakers]);

  // Fin de réunion : quand timeLeft atteint 0 -> summary
  useEffect(() => {
    if (timeLeft <= 0) {
      // arrête tout et redirige vers summary
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      navigate("/summary", { state: { memberTimes: speakers, totalSeconds } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Toggle speaking pour un participant
  const toggleSpeaking = (index) => {
    setSpeakers((prev) =>
      prev.map((p, i) => ({
        ...p,
        isSpeaking: i === index ? !p.isSpeaking : false,
      }))
    );
  };

  // === LOGIQUE D'ALLOCATION DYNAMIQUE ===
  // On veut : si personne n'a encore parlé -> allocation = initialPerMember
  // Sinon : pour les participants qui n'ont PAS encore parlé (hasSpoken === false),
  // on calcule : remainingToAllocate = totalSeconds - sum(time of those who HAVE spoken)
  // allocationForNotYetSpoken = remainingToAllocate / count_not_yet_spoken

  // somme des temps parlés par ceux qui ont déjà parlé
  const sumSpokenByHasSpoken = speakers
    .filter((s) => s.hasSpoken)
    .reduce((acc, s) => acc + s.time, 0);

  const notYetSpokenCount = speakers.filter((s) => !s.hasSpoken).length;

  // si personne n'a encore parlé -> allocation = initialPerMember
  // sinon on répartit entre ceux qui n'ont pas encore parlé
  const allocationForNotYetSpoken =
    notYetSpokenCount > 0
      ? Math.max(0, Math.floor((totalSeconds - sumSpokenByHasSpoken) / notYetSpokenCount))
      : 0;

  // pour affichage, on calcule pour chaque participant :
  // - si hasSpoken === false => allocation = initialPerMember (si personne n'a parlé) ou allocationForNotYetSpoken (si quelqu'un a parlé)
  // - si hasSpoken === true => on affiche le temps déjà parlé + si dépassement on l'indique

  // Calcul du dépassement global (pour info)
  const totalSpoken = speakers.reduce((acc, s) => acc + s.time, 0);
  const globalOvertime = Math.max(0, totalSpoken - totalSeconds);

  return (
    <div className="meeting" style={{ padding: 20 }}>
      <Header />
      <main>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0 }}>⏳ SpeakTime</h1>
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
              onClick={() => {
                // Pause/Resume global simple: si quelqu'un parle, on stoppe tout ; sinon on ne fait rien
                // (on garde l'UX simple : on lance via boutons "Parle")
                setSpeakers((prev) => prev.map((p) => ({ ...p, isSpeaking: false })));
              }}
              style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
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
            const allocation = isNotYetSpoken
              ? (sumSpokenByHasSpoken === 0 ? Math.floor(initialPerMember) : allocationForNotYetSpoken)
              : Math.floor(initialPerMember); // pour ceux qui ont déjà parlé, l'initialPerMember sert de référence

            const over = s.time > initialPerMember;
            const remainingForThis = isNotYetSpoken
              ? allocation // c'est le temps qui leur est alloué maintenant
              : Math.max(0, Math.floor(initialPerMember - Math.min(s.time, initialPerMember))); // si déjà parlé, on montre combien il 'avait' en départ (pour l'info)

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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                    {s.time > 0 && <span style={{ marginLeft: 8, fontSize: 12, color: "#555" }}>{s.hasSpoken ? " (a déjà parlé)" : ""}</span>}
                  </div>

                  <div style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
                    Allocation actuelle pour {isNotYetSpoken ? "ceux qui n'ont pas encore parlé" : "info"} :
                    <strong style={{ marginLeft: 8 }}>
                      {formatTime(allocation)}
                    </strong>
                  </div>

                  {over && (
                    <div style={{ marginTop: 8, color: "red", fontWeight: 600 }}>
                      🚨 A dépassé de {formatTime(Math.floor(s.time - initialPerMember))}
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
