// Auth module: Login page – calls backend and navigates to dashboard on success.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/service";
import "./Login.css";
import logo from "../../assets/swastiklogo.png";
import orelse from "../../assets/orelse.png";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(username.trim(), password);
      localStorage.setItem("swastik_token", res.access_token);
      localStorage.setItem("swastik_user", JSON.stringify(res.user || {}));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src={logo} alt="Swastik Hospital" className="top-logo" />

      <div className="login-box">
        <div className="login-header">
          <span>Login</span>
          <div className="locale">
            <label>Select Locale</label>
            <select>
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
            </select>
          </div>
        </div>

        <h3 className="login-title">SWASTIK HOSPITAL LOGIN</h3>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <div className="login-footer">
        <img src={orelse} alt="Orelese" />
      </div>
    </div>
  );
}

export default Login;
