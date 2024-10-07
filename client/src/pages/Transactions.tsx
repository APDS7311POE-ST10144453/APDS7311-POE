import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function Transactions() {
  const navigate = useNavigate();
  const alertShown = useRef(false); // Ref to track if the alert has been shown

  useEffect(() => {
    if (!isAuthenticated() && !alertShown.current) {
      alert("You are not logged in. Please log in to continue.");
      alertShown.current = true; // Set the ref to true after showing the alert
      navigate("/login");
    }
  }, [navigate]);

  const handleMainMenuClick = () => {
    navigate("/customer-dashboard");
  };

  return (
    <div className="dashboard-container">
      {/* Side Navigation Bar */}
      <div className="side-nav">
        <button className="nav-button" onClick={handleMainMenuClick}>
          Dashboard
        </button>
        <button className="nav-button">Transactions</button>
      </div>

      {/* Main Dashboard Content */}
      <div className="main-content">
        <h1>Transactions</h1>
      </div>
    </div>
  );
}

export default Transactions;
