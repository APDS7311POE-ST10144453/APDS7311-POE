import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CustomerDashboard.css";
import { isAuthenticated } from "../utils/auth";
import {
  getUserName,
  getUserAccountNum,
  getPayments,
  getBalance,
} from "../services/dataRequestService";

function CustomerDashboard() {
  const navigate = useNavigate();
  const alertShown = useRef(false); // Ref to track if the alert has been shown
  const [authChecked, setAuthChecked] = useState(false); // State to track if auth check is done

  useEffect(() => {
    if (!isAuthenticated() && !alertShown.current) {
      alert("You are not logged in. Please log in to continue.");
      alertShown.current = true; // Set the ref to true after showing the alert
      navigate("/login");
    } else {
      setAuthChecked(true); // Set auth check to true if authenticated
    }
  }, [navigate]);

  const [username, setUsername] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [ballance, setBallance] = useState("");
  interface Receipt {
    _id: string;
    transactionDate: string;
    transactionDescription: string;
    transferAmount: {
      $numberDecimal: string;
    };
    approvalStatus: string;
  }

  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const handleLocalPaymentClick = () => {
    navigate("/customer-payment-form");
  };

  const handleMainMenuClick = () => {
    navigate("/");
  };

  const handleTransactionClick = () => {
    navigate("/transactions");
  };

  useEffect(() => {
    if (!authChecked) {
      return; // Do nothing until auth check is done
    }

    // Fetch the user's name when the component loads
    async function fetchUsername() {
      const name = await getUserName();
      if (name) setUsername(name);
    }
    async function fetchUserAccountNum() {
      const AN = await getUserAccountNum();
      if (AN) setAccountNum(AN);
    }
    async function fetchUserReceipts() {
      const receipts = await getPayments();
      if (receipts) setReceipts(receipts);
    }

    async function fetchBalance() {
      const B = await getBalance();
      if (B) setBallance(B);
    }

    fetchUsername();
    fetchUserAccountNum();
    fetchBalance();
    fetchUserReceipts();
  }, [authChecked]);

  if (!authChecked) {
    return null; // Render nothing until auth check is done
  }

  const handleLogOutClick = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Side Navigation Bar */}
      <div className="side-nav">
        <button className="nav-button" onClick={handleMainMenuClick}>
          Main Menu
        </button>
        <button className="nav-button" onClick={handleTransactionClick}>
          Transactions
        </button>
        <button className="nav-button" onClick={handleLogOutClick}>
          Log Out
        </button>
      </div>

      {/* Main Dashboard Content */}
      <div className="main-content">
        <h1>Customer Dashboard</h1>

        {/* Greeting, Banking Details, and Payment Button Container */}
        <div className="greeting-banking-container">
          <div className="greeting-section">
            <h2>Hello, {username}</h2>
            <button
              className="make-payment-button"
              onClick={handleLocalPaymentClick}
            >
              Make Payment
            </button>
          </div>

          <div className="banking-details">
            <h2>Banking Details</h2>
            <div className="details-box">
              <p>Acc No: {accountNum}</p>
              <p>
                <strong>Available Balance</strong>: $ {ballance}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Receipts Section */}
        <div className="payment-receipts">
          <h3>Payment Receipts</h3>
          <div className="details-box">
            {receipts.length > 0 ? (
              receipts.map((receipt, index) => (
                <div key={`${receipt._id}-${index}`} className="receipt-card">
                  <div className="receipt-header">
                    <h4>Payment Receipt</h4>
                    <span className="receipt-date">
                      {new Date(receipt.transactionDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="receipt-body">
                    <div className="receipt-row">
                      <span className="receipt-label">Description:</span>
                      <span className="receipt-value">{receipt.transactionDescription}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">Amount:</span>
                      <span className="receipt-value receipt-amount">
                        ${parseFloat(receipt.transferAmount.$numberDecimal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="receipt-footer">
                    <button className="pay-again-button">Pay again</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No completed payments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
