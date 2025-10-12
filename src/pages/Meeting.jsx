import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Meeting() {
  const location = useLocation();
  const navigate = useNavigate();
  const { members = [], totalSeconds = 0 } = location.state || {};

  // Temps total restant
  const [remainingTime, setRemainingTime] = useState(totalSeconds);

  // Temps de parole individuel
  const [memberTimes, setMemberTimes] = useState(
    members.map((m) => ({
      name: m,
      time: 0, // en secondes
      speaking: false,
    }))
  );

  // Temps imparti par membre
  const timePerMember = totalSeconds / members.length;

  // Chronomètre général
  useEffect(() => {
    const interval = setInterval(() => {
      // Si le temps total est écoulé → fin
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          navigate("/summary", { state: { memberTimes, totalSeconds } });
          return 0;
        }
        return prev - 1;
      });

      // Incrémente le temps de celui/celle qui parle
      setMemberTimes((prev) =>
        prev.map((member) =>
          member.speaking
            ? { ...member, time: member.time + 1 }
            : member
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, totalSeconds]);

  // Démarrer / arrêter le chrono pour un membre
  const toggleSpeaking = (index) => {
    setMemberTimes((prev) =>
      prev.map((m, i) => ({
        ...m,
        speaking: i === index ? !m.speaking : false,
      }))
    );
  };

  // Calcul du dépassement global
  const totalSpoken = memberTimes.reduce((acc, m) => acc + m.time, 0);
  const overtime = Math.max(0, totalSpoken - totalSeconds);

  // Formater le temps en mm:ss
  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="meeting">
      <h1>🕒 SpeakTalk</h1>
      <p>
        ⏱️ Temps restant : <strong>{formatTime(remainingTime)}</strong>
      </p>

      {overtime > 0 && (
        <p style={{ color: "red" }}>
          ⚠️ Dépassement total : {formatTime(overtime)}
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        {memberTimes.map((member, i) => {
          const percent = Math.min((member.time / timePerMember) * 100, 100);
          const over = member.time > timePerMember;

          return (
            <div key={i} style={{ marginBottom: "15px" }}>
              <h3>
                {member.name}{" "}
                {over && <span style={{ color: "red" }}>🚨</span>}
              </h3>
              <div
                style={{
                  height: "15px",
                  background: "#ddd",
                  borderRadius: "5px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    background: over ? "red" : "#4caf50",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p>
                {formatTime(member.time)} / {formatTime(timePerMember)}
              </p>
              <button onClick={() => toggleSpeaking(i)}>
                {member.speaking ? "⏸️ Stop" : "▶️ Parle"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
