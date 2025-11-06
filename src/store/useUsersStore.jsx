import { create } from "zustand";

const API_USERS = "http://localhost:5000/api/users";

const useUsersStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // --- Récupérer un utilisateur par ID ---
  getUserById: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_USERS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la récupération de l'utilisateur");

      // Transformer id en _id pour la cohérence
      if (data.id && !data._id) {
        data._id = data.id;
      }

      // Le backend retourne l'utilisateur directement (pas enveloppé)
      set({ user: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // --- Modifier un utilisateur ---
  updateUser: async (id, formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ error: "Pas de token", loading: false });
      return false;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_USERS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const text = await res.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Réponse invalide du serveur`);
      }
      
      // Transformer id en _id pour la cohérence
      if (data.id && !data._id) {
        data._id = data.id;
      }
      
      if (!res.ok) {
        const errorMsg = data.message || "Erreur lors de la mise à jour";
        throw new Error(errorMsg);
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