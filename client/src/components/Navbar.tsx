import { Link } from "react-router-dom";
import "../css/Navbar.css";
import piggyBankImage from "../assets/Images/piggy-bank.png"; // Import the image if it's in the src folder

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <img src={piggyBankImage} alt="banking app" />
        <p>E-Z Banking</p>
      </div>
      <div className="nav-links">
        <Link className="nav-link" to="/">
          Home
        </Link>
        <Link className="nav-link" to="/register">
          Register
        </Link>
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </div>
    </nav>
  );
}