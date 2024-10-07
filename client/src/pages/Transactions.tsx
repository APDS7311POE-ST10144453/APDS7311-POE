import { useNavigate } from 'react-router-dom';
import '../css/Transaction.css';

function Transactions(){
    const navigate = useNavigate();

    const handleMainMenuClick = () => {
        navigate("/customer-dashboard");
      };

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