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
    recipientName: string;
    recipientBank: string;
    recipientAccountNumber: string;
    currency: string;
    swiftCode: string;
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

  const handlePayAgain = async (receipt: Receipt) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to make a payment');
        return;
      }

      // Send the encrypted account number directly without trying to re-encrypt
      const response = await fetch(
        "https://localhost:3000/api/transaction/transactFromReceipt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            recipientName: receipt.recipientName,
            recipientBank: receipt.recipientBank,
            recipientAccountNumber: receipt.recipientAccountNumber, // Send encrypted account number
            transferAmount: receipt.transferAmount.$numberDecimal,
            currency: receipt.currency,
            swiftCode: receipt.swiftCode,
            transactionDescription: receipt.transactionDescription,
            transactionDate: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        alert("Payment initiated successfully!");
        navigate("/transactions");
      } else {
        const errorData = await response.json();
        alert(`Payment failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Payment failed: ${error instanceof Error ? error.message : String(error)}`);
    }
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
                    <button 
                      className="pay-again-button"
                      onClick={() => handlePayAgain(receipt)}
                    >
                      Pay again
                    </button>
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
