import { create } from "zustand";
import { isTokenValid, isTokenExpired } from "../utils/jwtUtils";

const API_AUTH = `${process.env.REACT_APP_API_URL}/api/auth`;
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
      const res = await fetch(`${API_AUTH}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");

      set({ success: "Inscription réussie !", loading: false });
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // --- Connexion ---
  login: async (formData) => {
    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Email ou mot de passe incorrect");

      // Transformer id en _id pour la cohérence
      const user = { ...data.user };
      if (user.id && !user._id) {
        user._id = user.id;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // --- Déconnexion ---
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
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