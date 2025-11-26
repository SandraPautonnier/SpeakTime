/**
 * Utilitaires pour gérer les JWT
 */

/**
 * Décode un JWT sans vérification (pour un usage côté client uniquement)
 * @param {string} token - Le token JWT
 * @returns {object|null} - Le payload décodé ou null si invalide
 */
export const decodeJWT = (token) => {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Décoder la partie payload (index 1)
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Erreur lors du décodage du JWT:", error);
    return null;
  }
};

/**
 * Vérifie si un JWT a expiré
 * @param {string} token - Le token JWT
 * @returns {boolean} - true si expiré, false sinon
 */
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;

  // exp est en secondes, Date.now() en millisecondes
  const expirationTime = payload.exp * 1000;
  return Date.now() >= expirationTime;
};

/**
 * Vérifie si un token existe et n'a pas expiré
 * @returns {boolean} - true si le token est valide
 */
export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  return token && !isTokenExpired(token);
};

/**
 * Obtient le temps restant avant expiration (en secondes)
 * @param {string} token - Le token JWT
 * @returns {number} - Secondes restantes, ou 0 si expiré
 */
export const getTokenTimeRemaining = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return 0;

  const secondsRemaining = Math.floor(payload.exp - Date.now() / 1000);
  return Math.max(0, secondsRemaining);
};

/**
 * Extrait les données utilisateur du JWT
 * @param {string} token - Le token JWT
 * @returns {object|null} - Les données utilisateur ou null
 */
export const getUserFromToken = (token) => {
  const payload = decodeJWT(token);
  return payload ? { ...payload } : null;
};

/**
 * Vérifie si le token doit être rafraîchi (expire dans moins de 5 min)
 * @param {string} token - Le token JWT
 * @returns {boolean} - true si le token doit être rafraîchi
 */
export const shouldRefreshToken = (token) => {
  if (!token) return false;

  const timeRemaining = getTokenTimeRemaining(token);
  // Rafraîchir si moins de 5 minutes (300 secondes) restantes
  return timeRemaining < 300 && timeRemaining > 0;
};
