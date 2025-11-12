import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { memberTimes = [], totalSeconds = 0 } = location.state || {};

  // Format du temps
  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Temps imparti par membre
  const timePerMember = totalSeconds / memberTimes.length;

  // Temps total réellement parlé
  const totalSpoken = memberTimes.reduce((acc, m) => acc + m.time, 0);
  const overtime = Math.max(0, totalSpoken - totalSeconds);

  return (
    <div className="summary">
      <Navbar />
      <main>
        <section>
        <h2>📋 Résumé de la réunion</h2>

      <p>
        ⏱️ Durée prévue : <strong>{formatTime(totalSeconds)}</strong>
      </p>
      <p>
        🗣️ Temps total parlé : <strong>{formatTime(totalSpoken)}</strong>
      </p>
      {overtime > 0 && (
        <p style={{ color: "red" }}>
          ⚠️ Dépassement global : {formatTime(overtime)}
        </p>
      )}

      <div style={{ marginTop: "30px" }}>
        {memberTimes.map((member, i) => {
          const over = member.time > timePerMember;
          const percent = (member.time / timePerMember) * 100;

          return (
            <div key={i} style={{ marginBottom: "20px" }}>
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
                    width: `${Math.min(percent, 100)}%`,
                    height: "100%",
                    background: over ? "red" : "#4caf50",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              <p>
                {formatTime(member.time)} / {formatTime(timePerMember)}
              </p>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          fontSize: "16px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ← Retour au tableau de bord
      </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
