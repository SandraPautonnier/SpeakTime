/**
 * Formate la durée en secondes vers HH:MM ou MM:SS ou SS
 * @param {number} seconds - Durée en secondes
 * @returns {string} Format "HH:MM" ou "MM:SS" ou "SS"
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else if (minutes > 0) {
    return `${minutes}min ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

/**
 * Formate la liste des participants avec temps de parole
 * @param {array} participants - Array d'objets {name, speakingTime}
 * @returns {string} Format lisible "Alice (5min 20s), Bob (3min 10s)"
 */
export const formatParticipants = (participants) => {
  if (!participants || participants.length === 0) return "Aucun participant";

  return participants
    .map((p) => {
      const duration = formatDuration(p.speakingTime || 0);
      return `${p.name} (${duration})`;
    })
    .join(", ");
};

/**
 * Génère le titre d'une réunion au format "Réunion du DD/MM/YYYY"
 * @param {date} date - Date de la réunion
 * @returns {string} Titre généré
 */
export const generateMeetingTitle = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `Réunion du ${day}/${month}/${year}`;
};

/**
 * Formate une date pour l'affichage
 * @param {date} date - Date à formater
 * @returns {string} Format "DD/MM/YYYY à HH:MM"
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} à ${hours}:${minutes}`;
};
