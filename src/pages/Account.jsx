import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import useAuthStore from "../store/useAuthStore.jsx";
import useUsersStore from "../store/useUsersStore.jsx";
import { useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuthStore(); 
  const { user, getUserById, updateUser, deleteUser, error: storeError } = useUsersStore(); 

  const [editField, setEditField] = useState(""); 
  const [fieldValue, setFieldValue] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Debug
  useEffect(() => {}, [authUser]);

  // --- Charger les infos du user une seule fois ---
  useEffect(() => {
    // Vérifier si authUser est chargé
    if (authUser === null) {
      navigate("/login");
      return;
    }

    const userId = authUser?._id || authUser?.id;
    if (!authUser || !userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      await getUserById(userId);
      setLoading(false);
    };

    fetchUser();
  }, [authUser?._id, authUser?.id]);

  // Afficher l'erreur du store s'il y en a une
  useEffect(() => {
    if (storeError) {
      setError(storeError);
    }
  }, [storeError]);

  const userId = authUser?._id || authUser?.id;
  
  if (authUser === undefined || authUser === null) return <div style={{ padding: 20 }}><p>Chargement…</p></div>;
  if (!userId) return <div style={{ padding: 20 }}><p>Non connecté</p></div>;
  if (loading) return <div style={{ padding: 20 }}><p>Récupération des données du compte…</p></div>;

  // --- Cliquer sur modifier un champ ---
  const handleEditClick = (fieldName, currentValue) => {
    setEditField(fieldName);
    setFieldValue(currentValue || "");
    setMessage("");
    setError("");
  };

  const handleSave = async (field) => {
    if (!field || !userId) return;

    const formData = { [field]: fieldValue };
    const success = await updateUser(userId, formData);

    if (success) {
      setMessage(`✅ ${field} mis à jour avec succès !`);
      setEditField("");
    } else {
      setError(`❌ Échec de la mise à jour de ${field}`);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    if (!window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;

    const success = await deleteUser(userId);
    if (success) {
      setMessage("✅ Compte supprimé avec succès. Redirection en cours...");
      setTimeout(() => {
        logout();
        navigate("/");
      }, 1500);
    } else {
      setError("❌ Impossible de supprimer le compte.");
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
                disabled={editField !== "username"}
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
                disabled={editField !== "email"}
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
                    disabled={false}
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
