import { useNavigate } from 'react-router-dom';

function Transactions(){
    const navigate = useNavigate();

    const handleMainMenuClick = () => {
        navigate("/customer-dashboard");
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
                <h1>Transactions</h1>
                
                </div>
            </div>
    );
}

export default Transactions;