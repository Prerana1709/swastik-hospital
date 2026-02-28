import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateStaff, setStaffSession } from "../utils/staffAuth";
import swastikLogo from "../assets/swastiklogo.png";
import orelseLogo from "../assets/orelse.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [locale, setLocale] = useState("English");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const user = validateStaff(username.trim(), password);
    if (user) {
      setStaffSession(user);
      navigate("/dashboard");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="swastik-login-page">
      <div className="swastik-login-logo-wrap swastik-login-logo-red">
        <img src={swastikLogo} alt="Swastik Hospital" className="swastik-login-logo" />
      </div>

      <div className="swastik-login-card">
        <header className="swastik-login-card-header">
          <span className="swastik-login-tab active">Login</span>
          <div className="swastik-login-locale">
            <span className="swastik-login-locale-label">Select Locale</span>
            <select
              className="swastik-login-locale-select"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              aria-label="Select language"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
            </select>
          </div>
        </header>

        <div className="swastik-login-card-body">
          <h1 className="swastik-login-title">SWASTIK HOSPITAL LOGIN</h1>

          <form className="swastik-login-form" onSubmit={handleSubmit}>
            <div className="swastik-login-field">
              <label htmlFor="username">Username *</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>
            <div className="swastik-login-field">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <p className="swastik-login-error">{error}</p>}
            <button type="submit" className="swastik-login-btn">
              Login
            </button>
          </form>
        </div>
      </div>

      <footer className="swastik-login-footer">
        <img src={orelseLogo} alt="or else" className="swastik-login-orelse-logo" />
        <p className="swastik-login-powered">powered by possibilities</p>
      </footer>
    </div>
  );
}

export default Login;
