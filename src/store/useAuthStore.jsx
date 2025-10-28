import { create } from "zustand";

const useAuthStore = create((set) => ({
  loading: false,
  error: null,
  success: null,

  registerUser: async (userData) => {
    set({ loading: true, error: null, success: null });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur serveur.");
      }

      set({
        loading: false,
        success: "Inscription réussie ! Vérifiez votre email.",
      });
    } catch (err) {
      set({
        loading: false,
        error: err.message || "Une erreur est survenue.",
      });
    }
  },
}));

export default useAuthStore;