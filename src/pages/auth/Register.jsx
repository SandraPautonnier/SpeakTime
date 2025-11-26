import React, { useState } from "react";
import useAuthStore from "../../store/useAuthStore.jsx";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function Register() {

  const { register, error, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
    setSuccessMessage("");
  };

  const validateForm = () => {
    const { username, email, confirmEmail, password, confirmPassword } = formData;

    // Tous les champs requis
    if (!username || !email || !confirmEmail || !password || !confirmPassword) {
      return "Tous les champs sont obligatoires.";
    }

    // Validation username : 3-20 caractères, alphanumériques + tiret/underscore
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      return "Le nom d'utilisateur doit contenir 3-20 caractères (lettres, chiffres, tiret, underscore).";
    }

    // Les emails correspondent
    if (email !== confirmEmail) {
      return "Les emails ne correspondent pas.";
    }

    // Validation email : format valide
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "L'adresse email doit être valide.";
    }

    // Les mots de passe correspondent
    if (password !== confirmPassword) {
      return "Les mots de passe ne correspondent pas.";
    }

    // Validation password : 8-50 caractères, avec lettre + chiffre + caractère spécial, pas d'espace
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNoSpace = !/\s/.test(password);

    if (password.length < 8 || password.length > 50) {
      return "Le mot de passe doit contenir entre 8 et 50 caractères.";
    }

    if (!hasLetter) {
      return "Le mot de passe doit contenir au moins une lettre.";
    }

    if (!hasDigit) {
      return "Le mot de passe doit contenir au moins un chiffre.";
    }

    if (!hasSpecialChar) {
      return "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>).";
    }

    if (!hasNoSpace) {
      return "Le mot de passe ne doit pas contenir d'espace.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const success = await register(formData);
    if (success) {
      setSuccessMessage("Inscription réussie 🎉 Vous pouvez maintenant vous connecter !");
      setFormData({
        username: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="register">
      <Navbar />
      <main>
        <section>
          <div className='container'>
            <h2>Créer un compte</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom d'utilisateur</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder='Username'/>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required placeholder='email@exemple.com'/>
              </div>
              <div className="form-group">
                <label>Confirmer l'email</label>
                <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} autoComplete="email" required placeholder='email@exemple.com'/>
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" required placeholder='********'/>
              </div>
              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" required placeholder='********'/>
              </div>

              {formError && <p className="error">{formError}</p>}
              {error && <p className="error">{error}</p>}
              {successMessage && <p className="success">{successMessage}</p>}

              <button type="submit" className="btn-main" disabled={loading}>
                {loading ? "Création en cours..." : "S'inscrire"}
              </button>
            </form> 
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Register