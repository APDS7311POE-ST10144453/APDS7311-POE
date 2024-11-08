import { Link } from "react-router-dom";
import "../css/Navbar.css";
import piggyBankImage from "../assets/Images/piggy-bank.png"; // Import the image if it's in the src folder

/**
 * Navbar component that renders the navigation bar for the application.
 * 
 * @returns {JSX.Element} The JSX element representing the navigation bar.
 * 
 * The navigation bar includes:
 * - A brand section with an image and the application name.
 * - Navigation links to the Home, Register, and Login pages.
 */
export default function Navbar(): JSX.Element {
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