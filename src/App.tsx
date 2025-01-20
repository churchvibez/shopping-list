import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Active from "./pages/Active";
import History from "./pages/History";
import "./index.css";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="app-container">
      <header className="common-header">
        <h1 className="nav-header">Shopping List</h1>
        <nav>
          <ul className="nav-links">
            <li>
              <Link
                to="/active"
                className={`nav-link ${
                  location.pathname === "/active" ? "active-link" : ""
                }`}
              >
                Active
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className={`nav-link ${
                  location.pathname === "/history" ? "active-link" : ""
                }`}
              >
                History
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <Routes>
        {/* routes will redirect to /active when the root URL is loaded */}
        <Route path="/" element={<Navigate to="/active" replace />} />
        <Route path="/active" element={<Active />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/active" replace />} />

      </Routes>
    </div>
  );
};

export default App;
