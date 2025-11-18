import { create } from "zustand";

const API_MEETINGS = `${process.env.REACT_APP_API_URL}/api/meetings`;

const useMeetingsStore = create((set, get) => ({
  // State
  meetings: [],
  selectedMeeting: null,
  loading: false,
  error: null,
  success: null,

  // --- Récupérer tous les meetings ---
  fetchMeetings: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch(API_MEETINGS, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la récupération des réunions");

      // Le backend retourne { meetings: [...] }
      const meetingsData = data.meetings || [];
      set({ meetings: meetingsData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // --- Récupérer un meeting par ID ---
  getMeetingById: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_MEETINGS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la récupération de la réunion");

      set({ selectedMeeting: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // --- Créer un meeting ---
  createMeeting: async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(API_MEETINGS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la création de la réunion");

      set((state) => ({
        meetings: [...state.meetings, data.meeting],
        success: "Réunion créée avec succès !",
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // --- Mettre à jour un meeting ---
  updateMeeting: async (id, formData) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${API_MEETINGS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la mise à jour");

      set((state) => ({
        meetings: state.meetings.map((m) => (m._id === id ? data : m)),
        selectedMeeting: state.selectedMeeting?._id === id ? data : state.selectedMeeting,
        success: "Réunion mise à jour avec succès !",
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // --- Supprimer un meeting ---
  deleteMeeting: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${API_MEETINGS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la suppression de la réunion");
      }

      set((state) => ({
        meetings: state.meetings.filter((m) => m._id !== id),
        selectedMeeting: state.selectedMeeting?._id === id ? null : state.selectedMeeting,
        success: "Réunion supprimée avec succès !",
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
}));

export default useMeetingsStore;
