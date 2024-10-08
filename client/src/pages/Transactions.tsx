import React, { useEffect, useState } from "react";
import '../css/Transaction.css';

interface TransactionStatusProps {
  status: 'approved' | 'pending' | 'denied' | string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
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

function Transactions() {
  interface Transaction {
    transactionDate: string;
    transactionDescription: string;
    transferAmount: { $numberDecimal: string };
    approvalStatus: 'approved' | 'pending' | 'denied';
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    
    if (!token) {
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
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      if (Array.isArray(data.transactionList)) {
        setTransactions(data.transactionList);
      } else {
        throw new Error("Received data is not in the expected format");
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(`Failed to fetch transactions: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Side Navigation Bar */}
      <div className="side-nav">
        <button className="nav-button">Dashboard</button>
        <button className="nav-button">Transactions</button>
      </div>

      {/* Main Dashboard Content */}
      <div className="main-content">
        <div className="payment-receipts">
          <h1>Transactions</h1>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <div className="Transaction-details-box">
                <div className="receipt-item" key={index}>
                  <span>
                    {new Date(transaction.transactionDate).toLocaleDateString()} {transaction.transactionDescription} ${transaction.transferAmount.$numberDecimal}
                  </span>
                  <div>
                    <TransactionStatus status={transaction.approvalStatus} />
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