import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CustomerDashboard.css";
import { isAuthenticated } from "../utils/auth";
import { getUserName } from '../services/dataRequestService';
import { getUserAccountNum } from '../services/dataRequestService';
import { getPayments } from '../services/dataRequestService';
import { getBalance } from '../services/dataRequestService';



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

  if (!authChecked) {
    return null; // Render nothing until auth check is done
  }

  const handleLocalPaymentClick = () => {
    navigate("/customer-payment-form");
  };

  const handleMainMenuClick = () => {
    navigate("/");
  };

  const handleTransactionClick = () => {
    navigate("/transactions");
  };

  const [username, setUsername] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [ballance, setBallance] = useState('');
  interface Receipt {
    TransactionDate: string;
    TransactionDescription: string;
    transferAmount: number;
  }

  const [receipts, setReceipts] = useState<Receipt[]>([]);

useEffect(() => {
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
}, []);

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
                <strong>Available Balance</strong>: $ {ballance}</p>
            </div>
          </div>
        </div>

                {/* Payment Receipts Section */}
                <div className="payment-receipts">
                    <h3>Payment Receipts</h3>
                    <div className="details-box">
                        {receipts.length > 0 ? (
                            receipts.map((receipt, index) => (
                                <div key={index} className="receipt-item">
                                    <span>{receipt.TransactionDate} {receipt.TransactionDescription} ${receipt.transferAmount}</span>
                                    <button className="pay-again-button">Pay again</button>
                                </div>
                            ))
                        ) : (
                            <p>No receipts found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerDashboard;