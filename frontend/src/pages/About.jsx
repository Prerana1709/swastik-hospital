import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">
      <h1>About Swastik Psychiatric Hospital</h1>
      <p>Experienced psychiatrists, confidential treatment, 24/7 support.</p>
      <Link to="/">Home</Link>
    </div>
  );
}

export default About;
