import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../src/style.css";
import Home from "./pages/common/Home";
import Meeting from "./pages/common/Meeting";
import Summary from "./pages/common/Summary";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/authenticated/Dashboard";
import CreateGroup from "./pages/authenticated/CreateGroup";
import GroupDetail from "./pages/authenticated/GroupDetail";
import History from "./pages/authenticated/History";
import Account from "./pages/authenticated/Account";
import About from "./pages/common/About";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/group/:id" element={<GroupDetail />} />
          <Route path="/history" element={<History />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

