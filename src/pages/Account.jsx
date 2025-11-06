import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import useAuthStore from "../store/useAuthStore.jsx";
import useUsersStore from "../store/useUsersStore.jsx";
import { useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuthStore(); 
  const { user, getUserById, updateUser, deleteUser, error: storeError, loading: storeLoading } = useUsersStore(); 

  const [editField, setEditField] = useState(""); 
  const [fieldValue, setFieldValue] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // --- Charger les infos du user ---
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      const result = await getUserById(authUser._id); // update usersStore.user
      if (!result) {
        setError("Impossible de charger le profil utilisateur");
      }
      setLoading(false);
    };

    fetchUser();
  }, [authUser && authUser._id]); // Dépendance seulement sur authUser._id pour éviter les boucles infinies

  // Afficher l'erreur du store s'il y en a une
  useEffect(() => {
    if (storeError) {
      setError(storeError);
    }
  }, [storeError]);

  if (!authUser) return null; // sécurité
  if (loading) return <p>Récupération des données du compte…</p>;

  // --- Cliquer sur modifier un champ ---
  const handleEditClick = (fieldName, currentValue) => {
    setEditField(fieldName);
    setFieldValue(currentValue || "");
    setMessage("");
    setError("");
  };

  const handleSave = async (field) => {
    if (!field || !user) return;

    const formData = { [field]: fieldValue };
    const success = await updateUser(user._id, formData);

    if (success) {
      setMessage(`✅ ${field} mis à jour avec succès !`);
      setEditField("");
    } else {
      setError(`❌ Échec de la mise à jour de ${field}`);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer votre compte ?")) return;

    const success = await deleteUser(user._id);
    if (success) {
      logout();
      navigate("/");
    } else {
      setError("Impossible de supprimer le compte.");
    }
  };

  return (
    <div className="account">
      <Navbar />
      <main>
        <section>
          <div className="container">
            <h2>Mon compte</h2>
            <p>Voici vos informations personnelles :</p>

            {/* Username */}
            <div className="form-group">
              <label>Nom d'utilisateur</label>
              <input
                type="text"
                value={editField === "username" ? fieldValue : user?.username || authUser.username}
                onChange={(e) => setFieldValue(e.target.value)}
              />
              {editField === "username" ? (
                <>
                  <button onClick={() => handleSave("username")}>💾 Sauvegarder</button>
                  <button onClick={() => setEditField("")}>❌ Annuler</button>
                </>
              ) : (
                <button onClick={() => handleEditClick("username", user?.username || authUser.username)}>✏️ Modifier</button>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editField === "email" ? fieldValue : user?.email || authUser.email}
                onChange={(e) => setFieldValue(e.target.value)}
              />
              {editField === "email" ? (
                <>
                  <button onClick={() => handleSave("email")}>💾 Sauvegarder</button>
                  <button onClick={() => setEditField("")}>❌ Annuler</button>
                </>
              ) : (
                <button onClick={() => handleEditClick("email", user?.email || authUser.email)}>✏️ Modifier</button>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Mot de passe</label>
              {editField === "password" ? (
                <>
                  <input
                    type="password"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                  />
                  <button onClick={() => handleSave("password")}>💾 Sauvegarder</button>
                  <button onClick={() => setEditField("")}>❌ Annuler</button>
                </>
              ) : (
                <>
                  <span>********</span>
                  <button onClick={() => handleEditClick("password", "")}>✏️ Modifier</button>
                </>
              )}
            </div>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            

            <button onClick={handleDelete} className="btn-delete">
              Supprimer mon compte
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Account;
