import '../css/Transaction.css';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth"; // Assume getToken fetches the JWT token

function Transactions() {
  const navigate = useNavigate();
  const alertShown = useRef(false);
  interface Transaction {
    transactionDate: string;
    transactionDescription: string;
    transferAmount: { $numberDecimal: string };
    approvalStatus: 'approved' | 'pending' | 'denied';
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]); // Ensure transactions is always an array
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!isAuthenticated() && !alertShown.current) {
      alert("You are not logged in. Please log in to continue.");
      alertShown.current = true;
      navigate("/login");
    } else {
      const token = localStorage.getItem('token');
      console.log("Token retrieved:", token); // Debug: Log the token

      // Fetch transactions
      const fetchTransactions = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/transaction/getTransactions', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
              'Content-Type': 'application/json',
            },
          });

          console.log("Response status:", response.status); // Debug: Log the response status
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Response error text:", errorText); // Debug: Log the response error text
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Fetched transactions:", data); // Debug: Log the fetched transactions
          setTransactions(data.transactionList); // Assuming the response has a transactionList property
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTransactions();
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Side Navigation Bar */}
      <div className="side-nav">
        <button className="nav-button" onClick={() => navigate("/customer-dashboard")}>Dashboard</button>
        <button className="nav-button">Transactions</button>
      </div>

      {/* Main Dashboard Content */}
      <div className="main-content">
        <div className="payment-receipts">
          <h1> Transactions </h1>
          <div className="details-box">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <div className="receipt-item" key={index}>
                  <span>
                    {new Date(transaction.transactionDate).toLocaleDateString()} {transaction.transactionDescription} ${transaction.transferAmount.$numberDecimal}
                  </span>
                </div>
              ))
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;