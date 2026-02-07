import "./Login.css";
import logo from "../assets/swastiklogo.png";
import orelse from "../assets/orelse.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: replace with real authentication later
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      {/* Top Logo */}
      <img src={logo} alt="Swastik Hospital" className="top-logo" />

      {/* Login Box */}
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

        <div className="form-group">
          <label>Username *</label>
          <input type="text" placeholder="Enter your username" />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <img src={orelse} alt="Orelese" />
      </div>
    </div>
  );
}

export default Login;
