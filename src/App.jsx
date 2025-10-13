import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../src/style.css";
import Home from "./pages/Home";
import Meeting from "./pages/Meeting";
import Summary from "./pages/Summary";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </div>
    </Router>
  );
}

