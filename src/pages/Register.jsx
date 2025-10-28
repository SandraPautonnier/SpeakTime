import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore.jsx";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Register() {

  const { register, error, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Vérification des emails
    if (formData.email !== formData.confirmEmail) {
      setValidationError("Les adresses e-mail ne correspondent pas.");
      return;
    }

    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Mot de passe sécurisé : au moins 8 caractères + un caractère spécial
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setValidationError(
        "Le mot de passe doit contenir au moins 8 caractères et un caractère spécial."
      );
      return;
    }

    await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="register">
      <Navbar />
      <main>
        <section>
          <div className='container'>
            <h2>Créer un compte</h2>
            <form>
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
                <input type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" required placeholder='motdepasse123'/>
              </div>
              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" required placeholder='motdepasse123'/>
              </div>
              {validationError && (
                <p className="error-message">{validationError}</p>
              )}
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="btn-main" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "S'inscrire"}
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