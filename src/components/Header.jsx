import Logo from "../assets/Logo_SpeakTime.png"

const Header = () => {
  return (
    <header>
        <div className="header-content">
            <img className="logo" src={Logo} alt="Logo SpeakTime" />
            <h1>SpeakTime</h1>
        </div>
        <button className="btn-secondary">À Propos</button>
    </header>
  )
}

export default Header