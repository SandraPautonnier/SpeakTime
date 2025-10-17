import Logo from "../assets/Logo_SpeakTime.png"

const Header = () => {
  return (
    <header>
      <div className="header-nav">
        <div className="header-logo">
            <img className="logo" src={Logo} alt="Logo SpeakTime" />
            <h1>SpeakTime</h1>
        </div>
        <nav>
          <button className="btn-secondary">À Propos</button>
        </nav>
      </div>
      <div className="banner">
        <h2>Bienvenue sur SpeakTime</h2>
        <p>L’application qui vous aide à gérer le temps de parole pendant vos réunions !</p>
      </div>
    </header>
  )
}

export default Header