// apiclient.js
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

/**
 * Fonction interne pour effectuer un appel fetch
 * @param {string} endpoint 
 * @param {object} options 
 * @returns {Promise<any>}
 */
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const config = { ...options, headers };
  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Gestion des erreurs 401
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Session expirée, veuillez vous reconnecter.");
    }

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else if (!response.ok) {
      const text = await response.text();
      console.error("Réponse non-JSON:", text);
      throw new Error(`Erreur serveur ${response.status}`);
    } else {
      throw new Error("Réponse invalide du serveur");
    }

    if (!response.ok) {
      throw new Error(data.message || `Erreur ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};

/**
 * Méthodes API simplifiées
 */
export const apiClient = {
  get: (endpoint, options = {}) => fetchAPI(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) => fetchAPI(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) => fetchAPI(endpoint, { ...options, method: "PUT", body }),
  delete: (endpoint, body, options = {}) => fetchAPI(endpoint, { ...options, method: "DELETE", body }),
};
