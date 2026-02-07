import "./Header.css";
import logo from "../../assets/swastiklogo.png";

function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Swastik Hospital" />
    </header>
  );
}

export default Header;
