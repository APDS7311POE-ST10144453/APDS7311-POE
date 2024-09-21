import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PaymentForm.css';

function CustomerPaymentForm() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/customer-dashboard');
    };

    return (
        <div className="payment-form-container">
            <h1 className="form-title">Payment Form</h1>
            <form className="payment-form">
                <div className="form-group">
                    <label htmlFor="recipient-name">Recipient's Name:</label>
                    <input type="text" id="recipient-name" placeholder="Enter Recipient's Name" />
                </div>
                <div className="form-group">
                    <label htmlFor="recipient-bank">Recipient's Bank:</label>
                    <input type="text" id="recipient-bank" placeholder="Enter Recipient's Bank" />
                </div>
                <div className="form-group">
                    <label htmlFor="recipient-account-no">Recipient's account no:</label>
                    <input type="text" id="recipient-account-no" placeholder="Enter Recipient's Account No" />
                </div>
                <div className="form-group">
                    <label htmlFor="amount-transfer">Amount to transfer:</label>
                    <input type="text" id="amount-transfer" placeholder="Enter Amount you want to pay" />
                </div>
                <div className="form-group">
                    <label htmlFor="swift-code">Enter SWIFT Code:</label>
                    <input type="text" id="swift-code" placeholder="Enter Bank Swift Code" />
                </div>
                <div className="form-buttons">
                    <button type="submit" className="pay-now-button">PAY Now</button>
                    <button type="button" className="cancel-button">Cancel</button>
                    <button type="button" className="back-button" onClick={handleBackClick}>Back</button>
                </div>
            </form>
        </div>
    );
}

export default CustomerPaymentForm;