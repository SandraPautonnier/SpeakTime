// Client API avec gestion du JWT, refresh token et des erreurs
import { shouldRefreshToken } from "./jwtUtils";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_API_URL ||
  "https://backend-speaktime.onrender.com";
console.log(API_BASE_URL);

// Flag pour éviter les requêtes de refresh concurrentes
let isRefreshing = false;
let refreshPromise = null;

/**
 * Rafraîchit le token JWT
 * @returns {Promise<string|null>} - Le nouveau token ou null si échec
 */
const refreshToken = async () => {
  // Si déjà en cours de refresh, attendre le résultat
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Pas de token disponible");
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token invalide, déconnecter l'utilisateur
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expirée");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du refresh");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        return data.token;
      }

      throw new Error("Pas de token reçu du serveur");
    } catch (error) {
      console.error("Erreur lors du refresh token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Effectue une requête API avec authentification JWT
 * @param {string} endpoint - L'endpoint de l'API (ex: /api/groups)
 * @param {object} options - Options fetch (method, body, etc.)
 * @returns {Promise<any>} - La réponse JSON
 */
export const apiCall = async (endpoint, options = {}) => {
  let token = localStorage.getItem("token");

  // Vérifier si le token doit être rafraîchi
  if (token && shouldRefreshToken(token)) {
    console.log("Token expire bientôt, rafraîchissement...");
    const newToken = await refreshToken();
    if (newToken) {
      token = newToken;
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Ajouter le token JWT si disponible
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  // Convertir body en JSON si ce n'est pas déjà fait
  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Si le token a expiré (401), nettoyer le localStorage
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Rediriger vers la page de connexion
      window.location.href = "/login";
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    // Si rate limiting (429), attendre avant de réessayer
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After") || 15;
      throw new Error(
        `Trop de requêtes. Veuillez attendre ${retryAfter} secondes avant de réessayer.`
      );
    }

    // Vérifier le type de contenu de la réponse
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // Si la réponse n'est pas JSON, c'est probablement une erreur serveur
      const text = await response.text();

      if (!response.ok) {
        console.error("Non-JSON Response:", text);
        throw new Error(
          `Erreur serveur ${response.status}. Veuillez réessayer ou contacter le support.`
        );
      }

      // Si c'est un succès mais pas du JSON, c'est aussi une erreur
      throw new Error("Réponse invalide du serveur (pas du JSON)");
    }

    if (!response.ok) {
      // Ne pas révéler les détails du serveur
      let errorMessage = data.message || `Erreur ${response.status}`;

      // Messages génériques pour éviter les fuites d'infos
      if (response.status === 404) {
        errorMessage = "Erreur serveur 404";
      } else if (response.status === 500) {
        errorMessage = "Erreur serveur 500";
      } else if (response.status >= 500) {
        errorMessage = "Une erreur est survenue. Veuillez réessayer plus tard.";
      }

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Effectue une requête GET
 */
export const apiGet = (endpoint, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "GET",
  });
};

/**
 * Effectue une requête POST
 */
export const apiPost = (endpoint, body, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "POST",
    body,
  });
};

/**
 * Effectue une requête PUT
 */
export const apiPut = (endpoint, body, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "PUT",
    body,
  });
};

/**
 * Effectue une requête DELETE
 */
export const apiDelete = (endpoint, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "DELETE",
  });
};

/**
 * Effectue une requête PATCH
 */
export const apiPatch = (endpoint, body, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "PATCH",
    body,
  });
};
