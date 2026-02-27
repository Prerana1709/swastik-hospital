import { Link } from "react-router-dom";

function Doctors() {
  return (
    <div className="doctors-page">
      <h1>Our Doctors</h1>
      <p>Experienced psychiatrists and specialists.</p>
      <Link to="/">Home</Link>
    </div>
  );
}

export default Doctors;
