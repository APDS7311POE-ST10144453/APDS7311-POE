import React, { useState } from 'react';
import '../css/PaymentForm.css';
import SwiftCodeTextBox from '../components/SwiftCodeTextBox'; // Import the SwiftCodeTextBox component
import { useEffect, useRef } from "react";
import "../css/PaymentForm.css";
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from 'react-router-dom';
import { getUserAccountNum } from '../services/dataRequestService';

function CustomerPaymentForm() {
  const [recipientName, setRecipientName] = useState('');
  const [recipientBank, setRecipientBank] = useState('');
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [currency, setCurrency] = useState('USD'); // Example currency
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
  const [accountNum, setAccountNum] = useState("");

  async function fetchUserAccountNum() {
    const AN = await getUserAccountNum();
    if (AN) setAccountNum(AN);
  }

  const handlePayClick = async (e: any) => {
      e.preventDefault(); // Prevent the default form submission
      try {
        const response = await fetch("https://localhost:3000/api/transaction/transact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            senderAccountNumber: accountNum, // Replace this with actual sender account number (e.g., from the logged-in user)
            recipientName,
            recipientBank,
            recipientAccountNumber,
            transferAmount,
            currency,
            swiftCode,
            TransactionDescription: "Payment for services", // Add a description
            TransactionDate: new Date().toISOString() // Add the current date
          })
        });
    
        console.log("Server response:", response); // Log the raw response from the server
    
        if (response.ok) {
          const data = await response.json();
          console.log("Response data:", data); // Log the parsed response data
          alert("Payment Successful!");
          navigate("/customer-dashboard");
        } else {
          const errorData = await response.json();
          console.log("Error data:", errorData); // Log the error data
          alert(`Payment failed: ${errorData.error}`);
        }
      } catch (error: any) {
        console.error("Fetch error:", error); // Log the fetch error
        alert(`Payment failed: ${error.message}`);
      }
    };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-title">Payment Form</h1>
        <form className="payment-form" onSubmit={handlePayClick}>
          <div className="form-group">
            <label htmlFor="recipient-name">Recipient's Name:</label>
            <input
              className="input-field"
              type="text"
              id="recipient-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter Recipient's Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="recipient-bank">Recipient's Bank:</label>
            <input
              className="input-field"
              type="text"
              id="recipient-bank"
              value={recipientBank}
              onChange={(e) => setRecipientBank(e.target.value)}
              placeholder="Enter Recipient's Bank"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="recipient-account-no">Recipient's account no:</label>
            <input
              className="input-field"
              type="text"
              id="recipient-account-no"
              value={recipientAccountNumber}
              onChange={(e) => setRecipientAccountNumber(e.target.value)}
              placeholder="Enter Recipient's Account No"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount-transfer">Amount to transfer:</label>
            <input
              className="input-field"
              type="text"
              id="amount-transfer"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter Amount you want to pay"
              required
            />
          </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input className="input-field" type="text" id="description" placeholder="Enter payment description" />
                    </div>
          <div className="form-group">
            <label htmlFor="swift-code">Enter SWIFT Code:</label>
            <SwiftCodeTextBox value={swiftCode} onChange={setSwiftCode} /> {/* Assuming SwiftCodeTextBox takes a value and onChange prop */}
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
