import React, { useEffect, useState } from "react";
import "../css/EmployeeDashboard.css";

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

function EmployeeDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // Add error state

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
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
        const data = await response.json();
        console.log("Received data:", data);  // Debug log
        console.log("Transactions:", data.transactions);
        setTransactions(data.transactions);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error in fetchPendingTransactions:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (transactionId: string) => {
    try {
      const token = localStorage.getItem("token");
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
        // Refresh the transactions list
        fetchPendingTransactions();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitToSwift = async (transactionId: string) => {
    try {
      const token = localStorage.getItem("token");
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
        const result = await response.json();
        alert(result.message);
        fetchPendingTransactions();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status: string) => {
    return `status-${status.toLowerCase()}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="employee-dashboard-container">
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
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
                onClick={() => handleVerify(transaction._id)}
                disabled={transaction.approvalStatus !== "pending"}
              >
                Verify Transaction
              </button>
              <button
                className="action-button"
                onClick={() => handleSubmitToSwift(transaction._id)}
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
