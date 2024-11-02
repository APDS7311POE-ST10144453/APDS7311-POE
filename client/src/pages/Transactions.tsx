import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Transaction.css';
import { isAuthenticated } from "../utils/auth";

interface TransactionStatusProps {
  status: 'approved' | 'pending' | 'denied' | 'completed';
}


const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => {
  const getStatusColor = (): string => {
    switch (status) {
      case 'completed': return 'blue';
      case 'approved': return 'green';
      case 'pending': return 'orange';
      case 'denied': return 'red';
      default: return 'gray';
    }
  };

  return (
    <span style={{ 
      color: getStatusColor(), 
      fontWeight: 'bold',
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  );
};

/**
 * Transactions component fetches and displays a list of transactions for the authenticated user.
 * 
 * This component handles:
 * - Navigation to the main menu and login page.
 * - Fetching transactions from the server.
 * - Displaying loading and error states.
 * - Rendering the list of transactions with details such as date, description, amount, and status.
 * 
 * @returns {JSX.Element} The rendered Transactions component.
 */
function Transactions(): JSX.Element {
  const navigate = useNavigate();
  const alertShown = useRef(false);

  const handleMainMenuClick = (): void => {
    navigate("/customer-dashboard");
  };

  const handleLogOutClick = (): void => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  useEffect(() => {
    if (!isAuthenticated() && !alertShown.current) {
      alert("You are not logged in. Please log in to continue.");
      alertShown.current = true;
      navigate("/login");
    }
  }, [navigate]);
  
  interface Transaction {
    _id: string;
    senderLookupHash: string;
    transactionDate: string;
    transactionDescription: string;
    transferAmount: { $numberDecimal: string };
    approvalStatus: 'approved' | 'pending' | 'denied' | 'completed';
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    
    if (!(token != null && token.length > 0)) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://localhost:3000/api/transaction/getTransactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status.toString()}, message: ${errorText}`);
      }

      const data = await response.json() as { transactionList: Transaction[] };
      if (Array.isArray(data.transactionList)) {
        setTransactions(data.transactionList);
      } else {
        throw new Error("Received data is not in the expected format");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Failed to fetch transactions: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error != null) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="side-nav">
        <button className="nav-button" onClick={handleMainMenuClick}>
          Main Menu
        </button>
        <button className="nav-button" onClick={(): void => {
          void fetchTransactions();
        }}>
          Transactions
        </button>
        <button className="nav-button" onClick={handleLogOutClick}>
          Log Out
        </button>
      </div>

      <div className="main-content">
        <div className="payment-receipts">
          <h1>Transactions</h1>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <div className="Transaction-details-box" key={index}>
                <div className="receipt-item">
                  <div className="transaction-header">
                    <div className="transaction-date">
                      {new Date(transaction.transactionDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <TransactionStatus status={transaction.approvalStatus} />
                  </div>
                  
                  <div className="transaction-details">
                    <div className="detail-item">
                      <span className="detail-label">Description</span>
                      <span className="detail-value">{transaction.transactionDescription}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount</span>
                      <span className="detail-value transaction-amount">
                        ${parseFloat(transaction.transferAmount.$numberDecimal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;