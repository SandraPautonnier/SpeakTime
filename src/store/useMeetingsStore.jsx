import { create } from "zustand";
import { apiGet, apiPost } from "../utils/apiClient";

const useMeetingsStore = create((set, get) => ({
  // State
  meetings: [],
  selectedMeeting: null,
  loading: false,
  error: null,
  success: null,

  // --- Récupérer tous les meetings ---
  fetchMeetings: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiGet("/api/meetings");
      const meetingsData = data.meetings || [];
      set({ meetings: meetingsData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // --- Récupérer un meeting par ID ---
  getMeetingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await apiGet(`/api/meetings/${id}`);
      set({ selectedMeeting: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // --- Créer un meeting ---
  createMeeting: async (formData) => {
    set({ loading: true, error: null, success: null });
    try {
      const data = await apiPost("/api/meetings", formData);
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
