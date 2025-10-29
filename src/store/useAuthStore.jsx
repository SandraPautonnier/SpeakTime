import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  // 🔹 Inscription
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de l'inscription");

      // Sauvegarde token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      console.error("Erreur d'inscription :", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // 🔹 Connexion
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur de connexion");

      // Sauvegarde token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      console.error("Erreur de connexion :", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // 🔹 Déconnexion
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, error: null });
  },
}));

export default useAuthStore;
