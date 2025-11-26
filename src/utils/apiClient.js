// Client API avec gestion du JWT et des erreurs

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Effectue une requête API avec authentification JWT
 * @param {string} endpoint - L'endpoint de l'API (ex: /api/groups)
 * @param {object} options - Options fetch (method, body, etc.)
 * @returns {Promise<object>} - La réponse JSON
 */
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

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
      throw new Error(data.message || `Erreur ${response.status}`);
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
