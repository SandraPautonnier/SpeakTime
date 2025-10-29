import Logo from "../assets/Logo_SpeakTime.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faUser, faRightFromBracket, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from "../store/useAuthStore.jsx"; 

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout(); // déconnecte l'utilisateur
    setMenuOpen(false);
    navigate('/'); // redirection vers l'accueil après déconnexion
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header>
      <div className="header-nav">
        <div className="header-logo">
            <img className="logo" src={Logo} alt="Logo SpeakTime" />
            <h1>SpeakTime</h1>
        </div>
        <nav ref={navRef}>
          {/* Bouton hamburger */}
          <div className="hamburger" onClick={toggleMenu}>
            {menuOpen ? (
              <span className="close-nav">&times;</span>
            ) : (
              <>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </>
            )}
          </div>
          {/* Menu de navigation */}
          <ul className={`nav-container ${menuOpen ? "open" : ""}`}>
            {!user ? (
              // Menu si non connecté
              <>
                <li>
                  <Link className="nav-link" to="/" onClick={() => setMenuOpen(false)}>
                    <FontAwesomeIcon icon={faHouseChimney} /> Accueil
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" to="/login" onClick={() => setMenuOpen(false)}>
                    <FontAwesomeIcon icon={faUser} /> Se connecter
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" to="/register" onClick={() => setMenuOpen(false)}>
                    <FontAwesomeIcon icon={faUser} /> S'inscrire
                  </Link>
                </li>
              </>
            ) : (
              // Menu si connecté
              <>
                <li>
                  <Link className="nav-link" to="/dashboard" onClick={() => setMenuOpen(false)}>
                    <FontAwesomeIcon icon={faTachometerAlt} /> Mon tableau de bord
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" to="/account" onClick={() => setMenuOpen(false)}>
                    <FontAwesomeIcon icon={faUser} /> Mon compte
                  </Link>
                </li>
                <li>
                  <button className="nav-link btn-logout" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} /> Se déconnecter
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar;