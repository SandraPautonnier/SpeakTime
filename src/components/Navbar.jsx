import Logo from "../assets/Logo_SpeakTime.png"
import { useNavigate, Link  } from 'react-router-dom';

const Navbar = () => {
  return (
    <header>
      <div className="header-nav">
        <div className="header-logo">
            <img className="logo" src={Logo} alt="Logo SpeakTime" />
            <h1>SpeakTime</h1>
        </div>
        <nav>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/signin">Se Connecter</Link></li>
            <li><Link to="/register">S'inscrire</Link></li>
          </ul>
          <button className="btn-secondary">À Propos</button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar;