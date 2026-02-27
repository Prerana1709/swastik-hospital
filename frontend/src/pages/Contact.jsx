import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>Reach out for appointments or inquiries.</p>
      <Link to="/">Home</Link>
    </div>
  );
}

export default Contact;
