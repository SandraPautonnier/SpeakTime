import { create } from "zustand";
import { isTokenValid, isTokenExpired } from "../utils/jwtUtils";
import { apiPost } from "../utils/apiClient";
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

// Vérifier que le token n'a pas expiré au démarrage
const initialToken = storedToken && !isTokenExpired(storedToken) ? storedToken : null;
const initialUser = initialToken && storedUser && storedUser !== "undefined" 
  ? JSON.parse(storedUser) 
  : null;

// Si le token a expiré, nettoyer le localStorage
if (storedToken && isTokenExpired(storedToken)) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

const useAuthStore = create((set) => ({
  user: initialUser,
  token: initialToken,
  loading: false,
  error: null,
  success: null,

  // --- Inscription ---
  register: async (formData) => {
    set({ loading: true, error: null, success: null });
    try {
      const data = await apiPost("/api/auth/register", formData);
      set({ success: "Inscription réussie ! Vous pouvez maintenant vous connecter.", loading: false });
      return true;
    } catch (err) {
      // Laisser les messages de rate limiting passer
      if (err.message?.includes("Trop de requêtes")) {
        set({ error: err.message, loading: false });
        return false;
      }

      // Message générique pour ne pas révéler la structure du backend
      const errorMessage = err.message?.includes("404") || err.message?.includes("Erreur serveur") 
        ? "Une erreur est survenue. Veuillez réessayer plus tard."
        : err.message || "Erreur lors de l'inscription";
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // --- Connexion ---
  login: async (formData) => {
    set({ loading: true, error: null, success: null });
    try {
      const data = await apiPost("/api/auth/login", formData);
      
      if (!data.token) {
        throw new Error("Pas de token reçu du serveur");
      }

      // Transformer id en _id pour la cohérence
      const user = { ...data.user };
      if (user.id && !user._id) {
        user._id = user.id;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token: data.token, success: "Connexion réussie !", loading: false });
      return true;
    } catch (err) {
      // Laisser les messages de rate limiting passer
      if (err.message?.includes("Trop de requêtes")) {
        set({ error: err.message, loading: false });
        return false;
      }

      // Messages d'erreur génériques
      let errorMessage = "Erreur lors de la connexion";
      if (err.message?.includes("401") || err.message?.includes("incorrect")) {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (err.message?.includes("404") || err.message?.includes("Erreur serveur")) {
        errorMessage = "Une erreur est survenue. Veuillez réessayer plus tard.";
      } else {
        errorMessage = err.message || "Erreur lors de la connexion";
      }
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // --- Déconnexion ---
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  // --- Rafraîchir le token ---
  refreshToken: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Pas de token disponible");
      }

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL || "https://backend-speaktime.onrender.com"}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        set({ token: null, user: null, error: "Session expirée" });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return false;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du refresh");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        set({ token: data.token });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erreur lors du refresh token:", error);
      set({ token: null, user: null, error: "Session expirée" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
  },

  // --- Vérifier si authentifié ---
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return token && isTokenValid();
  },

  // --- Nettoyer erreur ---
  clearError: () => {
    set({ error: null });
  },

  // --- Nettoyer succès ---
  clearSuccess: () => {
    set({ success: null });
  },
}));

export default useAuthStore;