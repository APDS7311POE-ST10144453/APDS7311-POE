import { useNavigate } from 'react-router-dom';
import '../css/CustomerDashboard.css';

function CustomerDashboard() {
    const navigate = useNavigate();

    const handleLocalPaymentClick = () => {
        navigate('/customer-payment-form');
    };

    const handleMainMenuClick = () => {
        navigate("/");
    };

    const handleTransactionClick = () => {
        navigate("/transactions");
    };

    const handleLogOutClick = () => {
        navigate("/");
    }

    return (
        <div className="dashboard-container">
            {/* Side Navigation Bar */}
            <div className="side-nav">
                <button className="nav-button" onClick={handleMainMenuClick}>Main Menu</button>
                <button className="nav-button" onClick={handleTransactionClick}>Transactions</button>
                <button className="nav-button" onClick={handleLogOutClick}>Log Out</button>
            </div>

            {/* Main Dashboard Content */}
            <div className="main-content">
                <h1>Customer Dashboard</h1>

                {/* Greeting, Banking Details, and Payment Button Container */}
                <div className="greeting-banking-container">
                    <div className="greeting-section">
                        <h2>Hello, [Customer's Name]</h2>
                        <button className="make-payment-button" onClick={handleLocalPaymentClick}>Make Payment</button>
                    </div>

                    <div className="banking-details">
                        <h2>Banking Details</h2>
                        <div className="details-box">
                            <p>Acc No: XXXXXXXXXXXX</p>
                            <p><strong>Available Balance</strong>: $1500.00</p>
                        </div>
                    </div>
                </div>

                {/* Payment Receipts Section */}
                <div className="payment-receipts">
                    <h3>Payment Receipts</h3>
                    <div className="details-box">
                        <div className="receipt-item">
                            <span>2024/08/20 Sch Fees $200</span>
                            <button className="payment-button">Pay again</button>
                        </div>
                        <div className="receipt-item">
                            <span>2024/08/20 Home R $100</span>
                            <button className="payment-button">Pay again</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerDashboard;