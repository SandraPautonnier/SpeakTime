import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../src/style.css";
import Home from "./pages/Home";
import Meeting from "./pages/Meeting";
import Summary from "./pages/Summary";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Account from "./pages/Account";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

