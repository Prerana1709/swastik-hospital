import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login-page">
      <h1>Patient Login</h1>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default Login;
