import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import useAuthStore from "../store/useAuthStore.jsx";
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const { login, error, loading, user } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
    setSuccessMessage("");
  };

  // Validation simple
  const validateForm = () => {
    const { email, password } = formData;

    if (!email || !password) return "Tous les champs sont obligatoires.";
    if (!email.includes("@")) return "L'adresse email doit être valide.";
    return "";
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const success = await login(formData); 

      if (success) {
        setSuccessMessage("Connexion réussie 🎉 Bienvenue !");
        // redirection après un petit délai pour montrer le message
        setTimeout(() => {
          navigate('/dashboard', { replace: true }); // replace empêche le retour en arrière
        }, 500);
      } else {
        setFormError("Identifiants incorrects.");
      }
    } catch (err) {
      setFormError("Une erreur est survenue, veuillez réessayer.");
      console.error(err);
    }
  };

  // Redirection automatique si déjà connecté
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className='login'>
      <Navbar />
      <main>
        <section>
          <div className='container'>
            <h2>Se connecter</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required placeholder='email@exemple.com'/>
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="current-password" required placeholder='********'/>
              </div>

              {formError && <p className="error">{formError}</p>}
              {error && <p className="error">{error}</p>}
              {successMessage && <p className="success">{successMessage}</p>}
              
              <button type="submit" className="btn-main">
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Login;