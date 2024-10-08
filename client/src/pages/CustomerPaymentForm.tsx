import React, { useState, useEffect, useRef } from "react";
import "../css/PaymentForm.css";
import SwiftCodeTextBox from "../components/SwiftCodeTextBox"; // Import the SwiftCodeTextBox component
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { getUserAccountNum } from "../services/dataRequestService";
import useFormValidationErrors from "../validation/useFormValidationErrors";
import {
  getAccountNumberErrors,
  getDescriptionErrors,
  getNameErrors,
  getTransferAmountErrors,
} from "../validation/validation";

function CustomerPaymentForm() {
  const [recipientName, setRecipientName] = useState("");
  const [recipientBank, setRecipientBank] = useState("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [currency, setCurrency] = useState("USD"); // Example currency
  const [description, setdescription] = useState(""); // Description of the transaction
  const navigate = useNavigate();
  const alertShown = useRef(false); // Ref to track if the alert has been shown

  // custom hook for input validation
  const { errors, setFieldError, clearFieldError } = useFormValidationErrors([
    "recipientName",
    "recipientBank",
    "recipientAccountNumber",
    "transferAmount",
    "description",
  ]);

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
    fetchUserAccountNum();
    e.preventDefault(); // Prevent the default form submission

    // Input Validation
    clearFieldError("recipientName"); // Recipient Name
    const nameErrors = getNameErrors(recipientName);
    if (nameErrors.length > 0) {
      setFieldError("recipientName", nameErrors);
      return;
    }
    clearFieldError("recipientBank"); // Recipient Bank
    const recipientBankErrors = getNameErrors(recipientBank);
    if (recipientBankErrors.length > 0) {
      setFieldError("recipientBank", recipientBankErrors);
      return;
    }
    clearFieldError("recipientAccountNumber"); // Recipient Account Number
    const recipientAccountNumberErrors = getAccountNumberErrors(
      recipientAccountNumber
    );
    if (recipientAccountNumberErrors.length > 0) {
      setFieldError("recipientAccountNumber", recipientAccountNumberErrors);
      return;
    }
    clearFieldError("transferAmount"); // Transfer Amount
    const transferAmountErrors = getTransferAmountErrors(transferAmount);
    if (transferAmountErrors.length > 0) {
      setFieldError("transferAmount", transferAmountErrors);
      return;
    }
    clearFieldError("description"); // Description
    const descriptionErrors = getDescriptionErrors(description);
    if (descriptionErrors.length > 0) {
      setFieldError("description", descriptionErrors);
      return;
    }
    // TODO: Add swift code validation here
    // if (swiftCode has errors)
    // {
    //   return;
    // }

    try {
      const response = await fetch(
        "https://localhost:3000/api/transaction/transact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderAccountNumber: accountNum, // Replace this with actual sender account number (e.g., from the logged-in user)
            recipientName,
            recipientBank,
            recipientAccountNumber,
            transferAmount,
            currency,
            swiftCode,
            transactionDescription: description,
            transactionDate: new Date().toISOString(), // Add the current date
          }),
        }
      );

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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="recipient-name">Recipient's Name:</label>
              <input
                className="input-field"
                type="text"
                id="recipient-name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter Recipient's Name"
              />
              <text className="global-error-text">{errors["recipientName"]}</text>
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
              />
              <text className="global-error-text">{errors["recipientBank"]}</text>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="recipient-account-no">
                Recipient's account no:
              </label>
              <input
                className="input-field"
                type="text"
                id="recipient-account-no"
                value={recipientAccountNumber}
                onChange={(e) => setRecipientAccountNumber(e.target.value)}
                placeholder="Enter Recipient's Account No"
              />
              <text className="global-error-text">
                {errors["recipientAccountNumber"]}
              </text>
            </div>
            <div className="form-group">
              <label htmlFor="amount-transfer">Amount to transfer:</label>
              <input
                className="input-field"
                type="text"
                id="amount-transfer"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter transfer amount"
              />
              <text className="global-error-text">
                {errors["transferAmount"]}
              </text>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                className="input-field"
                type="text"
                id="description"
                placeholder="Enter payment description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setdescription(e.target.value)
                }
              />
              <text className="global-error-text">{errors["description"]}</text>
            </div>
            <div className="form-group">
              <label htmlFor="currency">Currency:</label>
              <select
                className="input-field"
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="ZAR">ZAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="AUD">AUD</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
                <option value="CNY">CNY</option>
                <option value="INR">INR</option>
                <option value="BRL">BRL</option>
                <option value="MXN">MXN</option>
                <option value="RUB">RUB</option>
                <option value="KRW">KRW</option>
                <option value="SGD">SGD</option>
                <option value="HKD">HKD</option>
                <option value="NOK">NOK</option>
                <option value="SEK">SEK</option>
                <option value="NZD">NZD</option>
                <option value="TRY">TRY</option>
                {/* Add more currencies as needed */}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="swift-code">Enter SWIFT Code:</label>
              <SwiftCodeTextBox value={swiftCode} onChange={setSwiftCode} />{" "}
              {/* Assuming SwiftCodeTextBox takes a value and onChange prop */}
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" className="pay-now-button">
              PAY Now
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={handleBackClick}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerPaymentForm;