import { useEffect, useState } from "react";
import "../css/EmployeeDashboard.css";
import { Logger } from "../utils/logger";
import { useNavigate } from "react-router-dom";

interface Transaction {
  _id: string;
  senderLookupHash: string;
  recipientLookupHash: string;
  recipientName: string;
  recipientBank: string;
  transferAmount: {
    $numberDecimal: string;
  };
  currency: string;
  swiftCode: string;
  transactionDescription: string;
  transactionDate: Date;
  approvalStatus: 'approved' | 'pending' | 'denied' | 'completed';
}

interface TransactionResponse {
  transactions: Transaction[];
  message?: string;
}

interface ErrorResponse {
  message: string;
}

/**
 * EmployeeDashboard component displays a dashboard for employees to manage and verify transactions.
 * 
 * @component
 * @returns {JSX.Element} The rendered EmployeeDashboard component.
 * 
 * @example
 * <EmployeeDashboard />
 * 
 * @remarks
 * This component fetches pending transactions from the server and displays them in a list.
 * Each transaction can be verified or submitted to SWIFT based on its approval status.
 * 
 * @function
 * @name EmployeeDashboard
 * 
 * @typedef {Object} Transaction
 * @property {string} _id - The unique identifier of the transaction.
 * @property {Date} transactionDate - The date of the transaction.
 * @property {string} currency - The currency of the transaction.
 * @property {Object} transferAmount - The amount to be transferred.
 * @property {string} recipientName - The name of the recipient.
 * @property {string} recipientBank - The bank of the recipient.
 * @property {string} swiftCode - The SWIFT code of the recipient's bank.
 * @property {string} transactionDescription - The description of the transaction.
 * @property {string} approvalStatus - The approval status of the transaction.
 * 
 * @typedef {Object} TransactionResponse
 * @property {Transaction[]} transactions - The list of transactions.
 * 
 * @typedef {Object} ErrorResponse
 * @property {string} message - The error message.
 * 
 * @state {Transaction[]} transactions - The list of transactions.
 * @state {boolean} loading - The loading state.
 * @state {string | null} error - The error message.
 * 
 * @method fetchPendingTransactions - Fetches the pending transactions from the server.
 * @method handleVerify - Verifies a transaction.
 * @method handleSubmitToSwift - Submits a transaction to SWIFT.
 * @method formatDate - Formats a date to a readable string.
 * @method getStatusClass - Returns the CSS class for a given status.
 */
function EmployeeDashboard(): JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!((token != null) && token.length > 0)) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://localhost:3000/api/employee/getPendingTransactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json() as TransactionResponse;
        setTransactions(data.transactions);
      } else {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(errorData.message || "Failed to fetch transactions");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (transactionId: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!((token != null) && token.length > 0)) return;

      const response = await fetch(
        `https://localhost:3000/api/employee/verifyTransaction/${transactionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        void fetchPendingTransactions();
      } else {
        const errorData = await response.json() as ErrorResponse;
        alert(errorData.message);
      }
    } catch (error) {
      const logger = new Logger();
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      logger.error(`Transaction verification failed: ${errorMessage}`);
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleSubmitToSwift = async (transactionId: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!((token != null) && token.length > 0)) return;

      const response = await fetch(
        `https://localhost:3000/api/employee/submitToSwift/${transactionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json() as ErrorResponse;
        alert(result.message);
        void fetchPendingTransactions();
      } else {
        const errorData = await response.json() as ErrorResponse;
        alert(errorData.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      alert(`Error: ${errorMessage}`);
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status: string): string => {
    return `status-${status.toLowerCase()}`;
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/employee-login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error != null) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="employee-dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Employee Dashboard</h1>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      
      <div className="transactions-container">
        {transactions.map((transaction) => (
          <div key={transaction._id} className="transaction-card">
            <div className="transaction-header">
              <h3>Transaction #{transaction._id.slice(-6)}</h3>
              <span className={`transaction-status ${getStatusClass(transaction.approvalStatus)}`}>
                {transaction.approvalStatus.toUpperCase()}
              </span>
            </div>
            
            <div className="transaction-details">
              <div className="detail-item">
                <span className="detail-label">Date</span>
                <span className="detail-value">{formatDate(transaction.transactionDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount</span>
                <span className="detail-value">
                  {transaction.currency} {parseFloat(transaction.transferAmount.$numberDecimal).toFixed(2)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Recipient</span>
                <span className="detail-value">{transaction.recipientName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Recipient Bank</span>
                <span className="detail-value">{transaction.recipientBank}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">SWIFT Code</span>
                <span className="detail-value">{transaction.swiftCode}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Description</span>
                <span className="detail-value">{transaction.transactionDescription}</span>
              </div>
            </div>

            <div className="transaction-actions">
              <button
                className="action-button"
                onClick={() => {
                  void handleVerify(transaction._id);
                }}
                disabled={transaction.approvalStatus !== "pending"}
              >
                Verify Transaction
              </button>
              <button
                className="action-button"
                onClick={() => {
                  void handleSubmitToSwift(transaction._id);
                }}
                disabled={transaction.approvalStatus !== "approved"}
              >
                Submit to SWIFT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
