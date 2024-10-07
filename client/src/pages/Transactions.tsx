import '../css/Transaction.css';
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function Transactions() {
  const navigate = useNavigate();
  const alertShown = useRef(false); // Ref to track if the alert has been shown

   const handleMainMenuClick = () => {
    navigate("/customer-dashboard");
  };
  
  useEffect(() => {
    if (!isAuthenticated() && !alertShown.current) {
      alert("You are not logged in. Please log in to continue.");
      alertShown.current = true; // Set the ref to true after showing the alert
      navigate("/login");
    }
  }, [navigate]);

      interface TransactionProps {
        status: 'approved' | 'pending' | 'declined';
    }
    
    const TransactionStatus: React.FC<TransactionProps> = ({ status }) => {
        const transactionStatus: 'approved' | 'pending' | 'declined' = 'approved'; // Define the transactionStatus variable
    
        return (
            <span className={`transaction-status ${status}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="dashboard-container">
            {/* Side Navigation Bar */}
            <div className="side-nav">
                <button className="nav-button" onClick={handleMainMenuClick}>Dashboard</button>
                <button className="nav-button">Transactions</button>
            </div>

            {/* Main Dashboard Content */}
            <div className="main-content">
            <div className="payment-receipts">
                    <h1> Transactions </h1>
                    <div className="details-box">
                        <div className="receipt-item">
                            <span>2024/08/20 Sch Fees $200</span>
                            <div>
                            <TransactionStatus status="approved" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    );
}

export default Transactions;
