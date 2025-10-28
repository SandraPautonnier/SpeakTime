import React from 'react'
import Logo from "../assets/Logo_SpeakTime.png";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="Logo SpeakTime" />
      <h2>SpeakTime</h2>
      <p>L’application qui vous aide à gérer le temps de parole pendant vos réunions !</p>
      <p>Mentions Légales © 2025 SpeakTime. Tous droits réservés.</p>
    </footer>
  )
}

export default Footer