import { create } from "zustand";
import { apiGet, apiPut } from "../utils/apiClient";

const useUsersStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // --- Récupérer un utilisateur par ID ---
  getUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await apiGet(`/api/users/${id}`);

      // Transformer id en _id pour la cohérence
      if (data.id && !data._id) {
        data._id = data.id;
      }

      set({ user: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // --- Modifier un utilisateur ---
  updateUser: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const data = await apiPut(`/api/users/${id}`, formData);

      // Transformer id en _id pour la cohérence
      if (data.id && !data._id) {
        data._id = data.id;
      }

      set({ user: data, loading: false });
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // --- Supprimer un utilisateur ---
  deleteUser: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_USERS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");

      set({ user: null, loading: false });
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
}));

export default useUsersStore;