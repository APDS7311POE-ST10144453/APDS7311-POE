import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PaymentForm.css';
import SwiftCodeTextBox from '../components/SwiftCodeTextBox'; // Import the SwiftCodeTextBox component
import { useEffect, useRef } from "react";
import "../css/PaymentForm.css";
import { isAuthenticated } from "../utils/auth";

function CustomerPaymentForm() {
  const navigate = useNavigate();
  const alertShown = useRef(false); // Ref to track if the alert has been shown

  useEffect(() => {
    if (!isAuthenticated() && !alertShown.current) {
      alert("You are not logged in. Please log in to continue.");
      alertShown.current = true; // Set the ref to true after showing the alert
      navigate("/login");
    }
  }, [navigate]);

  const handleBackClick = () => {
    navigate("/customer-dashboard");
  };

    return (
        <div className="page-container"> {/* Add this class */}
            <div className="form-container">
                <h1 className="form-title">Payment Form</h1>
                <form className="payment-form">
                    <div className="form-group">
                        <label htmlFor="recipient-name">Recipient's Name:</label>
                        <input className="input-field" type="text" id="recipient-name" placeholder="Enter Recipient's Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-bank">Recipient's Bank:</label>
                        <input className="input-field" type="text" id="recipient-bank" placeholder="Enter Recipient's Bank" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-account-no">Recipient's account no:</label>
                        <input className="input-field" type="text" id="recipient-account-no" placeholder="Enter Recipient's Account No" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount-transfer">Amount to transfer:</label>
                        <input className="input-field" type="text" id="amount-transfer" placeholder="Enter Amount you want to pay" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="swift-code">Enter SWIFT Code:</label>
                        <SwiftCodeTextBox /> {/* Replace the input field with the SwiftCodeTextBox component */}
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="pay-now-button">PAY Now</button>
                        <button type="button" className="cancel-button" onClick={handleBackClick}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
  );
}

export default CustomerPaymentForm;
