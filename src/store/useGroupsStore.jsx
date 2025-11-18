import { create } from "zustand";

const API_GROUPS = `${process.env.REACT_APP_API_URL}/api/groups`;

const useGroupsStore = create((set, get) => ({
  // State
  groups: [],
  selectedGroup: null,
  loading: false,
  error: null,
  success: null,

  // --- Récupérer tous les groupes ---
  fetchGroups: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_GROUPS, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la récupération des groupes");

      // Le backend retourne { groups: [...] }
      const groupsData = data.groups || [];
      set({ groups: groupsData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // --- Récupérer un groupe par ID ---
  getGroupById: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_GROUPS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la récupération du groupe");

      // Le backend retourne { group: {...} }
      set({ selectedGroup: data.group, loading: false });
      return data.group;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // --- Créer un groupe ---
  createGroup: async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(API_GROUPS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la création du groupe");

      // Le backend retourne { message: "...", group: {...} }
      const newGroup = data.group;
      set((state) => ({
        groups: [...state.groups, newGroup],
        success: "Groupe créé avec succès !",
        loading: false,
      }));
      return newGroup;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // --- Mettre à jour le nom du groupe ---
  updateGroupName: async (id, name) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${API_GROUPS}/${id}/name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la mise à jour");

      // Le backend retourne { message: "...", group: {...} }
      const updatedGroup = data.group;
      set((state) => ({
        groups: state.groups.map((g) => (g._id === id ? updatedGroup : g)),
        selectedGroup: state.selectedGroup?._id === id ? updatedGroup : state.selectedGroup,
        success: "Nom du groupe mis à jour !",
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // --- Mettre à jour la description du groupe ---
  updateGroupDescription: async (id, description) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${API_GROUPS}/${id}/description`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la mise à jour");

      // Le backend retourne { message: "...", group: {...} }
      const updatedGroup = data.group;
      set((state) => ({
        groups: state.groups.map((g) => (g._id === id ? updatedGroup : g)),
        selectedGroup: state.selectedGroup?._id === id ? updatedGroup : state.selectedGroup,
        success: "Description du groupe mise à jour !",
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // --- Ajouter des membres à un groupe ---
  addGroupMembers: async (id, memberNames) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${API_GROUPS}/${id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ members: memberNames }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de l'ajout de membres");

      // Le backend retourne { message: "...", group: {...} }
      const updatedGroup = data.group;
      set((state) => ({
        groups: state.groups.map((g) => (g._id === id ? updatedGroup : g)),
        selectedGroup: state.selectedGroup?._id === id ? updatedGroup : state.selectedGroup,
        success: "Participant ajouté avec succès !",
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // --- Retirer des membres d'un groupe ---
  removeGroupMembers: async (id, memberNames) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${API_GROUPS}/${id}/members`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ members: memberNames }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors du retrait de membres");

      // Le backend retourne { message: "...", group: {...} }
      const updatedGroup = data.group;
      set((state) => ({
        groups: state.groups.map((g) => (g._id === id ? updatedGroup : g)),
        selectedGroup: state.selectedGroup?._id === id ? updatedGroup : state.selectedGroup,
        success: "Participant retiré avec succès !",
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // --- Récupérer les membres d'un groupe ---
  getGroupMembers: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_GROUPS}/${id}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la récupération des membres");

      // Le backend retourne { members: [...], groupName: "..." }
      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // --- Supprimer un groupe ---
  deleteGroup: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${API_GROUPS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la suppression du groupe");
      }

      set((state) => ({
        groups: state.groups.filter((g) => g._id !== id),
        selectedGroup: state.selectedGroup?._id === id ? null : state.selectedGroup,
        success: "Groupe supprimé avec succès !",
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
}));

export default useGroupsStore;