import { create } from "zustand";

const useDashboardStore = create((set, get) => ({
  // State
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  groups: [],
  meetings: [],
  loading: false,
  error: null,

  // Récupérer les groupes depuis le backend
  fetchGroups: async () => {
    const { token } = get();
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur lors de la récupération des groupes");

      set({ groups: data.groups, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Récupérer l'historique des réunions depuis le backend
  fetchMeetings: async () => {
    const { token } = get();
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5000/api/meetings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur lors de la récupération des réunions");

      set({ meetings: data.meetings, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useDashboardStore;

