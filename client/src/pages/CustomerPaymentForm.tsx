import React, { useState, useEffect, useRef } from "react";
import "../css/PaymentForm.css";
import SwiftCodeTextBox from "../components/SwiftCodeTextBox";
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
import { Logger } from "../utils/logger";

interface PaymentResponse {
  error?: string;
  message?: string;
}

/**
 * CustomerPaymentForm component renders a payment form for customers to fill out and submit.
 * It includes fields for recipient's name, bank, account number, transfer amount, currency, SWIFT code, and description.
 * The form validates the input fields and ensures the user is authenticated before allowing submission.
 * On successful submission, it sends a payment request to the server.
 *
 * @returns {JSX.Element} The rendered payment form component.
 *
 * @component
 * @example
 * return (
 *   <CustomerPaymentForm />
 * )
 */
function CustomerPaymentForm(): JSX.Element {
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientBank, setRecipientBank] = useState<string>("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [swiftCode, setSwiftCode] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isSwiftCodeValid, setIsSwiftCodeValid] = useState<boolean>(false);
  const navigate = useNavigate();
  const alertShown = useRef(false);


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
      alertShown.current = true;
      navigate("/login");
    }
  }, [navigate]);

  const handleBackClick = (): void => {
    navigate("/customer-dashboard");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_accountNum, setAccountNum] = useState("");

  async function fetchUserAccountNum(): Promise<void> {
    const accountNumber = await getUserAccountNum();
    if (accountNumber != null) {
      setAccountNum(accountNumber);
    }
  }

  const handleIsValidChange = (valid: boolean): void => {
    setIsSwiftCodeValid(valid);
  };

  const handlePayClick = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    void fetchUserAccountNum();
    e.preventDefault();

    clearFieldError("recipientName");
    const nameErrors = getNameErrors(recipientName);
    if (nameErrors.length > 0) {
      setFieldError("recipientName", nameErrors);
      return;
    }
    clearFieldError("recipientBank");
    const recipientBankErrors = getNameErrors(recipientBank);
    if (recipientBankErrors.length > 0) {
      setFieldError("recipientBank", recipientBankErrors);
      return;
    }
    clearFieldError("recipientAccountNumber");
    const recipientAccountNumberErrors = getAccountNumberErrors(
      recipientAccountNumber
    );
    if (recipientAccountNumberErrors.length > 0) {
      setFieldError("recipientAccountNumber", recipientAccountNumberErrors);
      return;
    }
    clearFieldError("transferAmount");
    const transferAmountErrors = getTransferAmountErrors(transferAmount);
    if (transferAmountErrors.length > 0) {
      setFieldError("transferAmount", transferAmountErrors);
      return;
    }

    clearFieldError("description");
    const descriptionErrors = getDescriptionErrors(description);
    if (descriptionErrors.length > 0) {
      setFieldError("description", descriptionErrors);
      return;
    }

    if (!isSwiftCodeValid) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!((token != null) && token.length > 0)) {
        alert('Please log in to make a payment');
        return;
      }

      const response = await fetch(
        "https://localhost:3000/api/transaction/transact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            recipientName,
            recipientBank,
            recipientAccountNumber,
            transferAmount,
            currency,
            swiftCode,
            transactionDescription: description,
            transactionDate: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        alert("Payment Successful!");
        navigate("/customer-dashboard");
      } else {
        const errorData = await response.json() as PaymentResponse;
        alert(`Payment failed: ${String((errorData.error != null) || 'Unknown error')}`);
      }
    } catch (error: unknown) {
      const logger = new Logger();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Payment processing failed: ${errorMessage}`);
      alert(`Payment failed: ${errorMessage}`);
    } 
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-title">Payment Form</h1>
        <form className="payment-form" onSubmit={(e) => void handlePayClick(e)}>
          <div className="form-group">
            <label htmlFor="recipient-name">Recipient&apos;s Name:</label>
            <input
              className="input-field"
              type="text"
              id="recipient-name"
              value={recipientName}
              onChange={(e) => { setRecipientName(e.target.value); }}
              placeholder="Enter Recipient's Name"
            />
            <text className="global-error-text">{errors.recipientName}</text>
          </div>
          <div className="form-group">
            <label htmlFor="recipient-bank">Recipient&apos;s Bank:</label>
            <input
              className="input-field"
              type="text"
              id="recipient-bank"
              value={recipientBank}
              onChange={(e) => { setRecipientBank(e.target.value); }}
              placeholder="Enter Recipient's Bank"
            />
            <text className="global-error-text">{errors.recipientBank}</text>
          </div>
          <div className="form-group">
            <label htmlFor="recipient-account-no">
              Recipient&apos;s account no:
            </label>
            <input
              className="input-field"
              type="text"
              id="recipient-account-no"
              value={recipientAccountNumber}
              onChange={(e) => { setRecipientAccountNumber(e.target.value); }}
              placeholder="Enter Recipient's Account No"
            />
            <text className="global-error-text">
              {errors.recipientAccountNumber}
            </text>
          </div>
          <div className="form-group">
            <label htmlFor="amount-transfer">Amount to transfer:</label>
            <input
              className="input-field"
              type="text"
              id="amount-transfer"
              value={transferAmount}
              onChange={(e) => { setTransferAmount(e.target.value); }}
              placeholder="Enter Amount you want to pay"
            />
            <text className="global-error-text">
              {errors.transferAmount}
            </text>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              className="input-field"
              type="text"
              id="description"
              placeholder="Enter payment description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                { setDescription(e.target.value); }
              }
            />
            <text className="global-error-text">{errors.description}</text>
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency:</label>
            <select
              className="input-field"
              id="currency"
              value={currency}
              onChange={(e) => { setCurrency(e.target.value); }}
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
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="swift-code">Enter SWIFT Code:</label>
            <SwiftCodeTextBox
              value={swiftCode}
              onChange={(data) => {
                setSwiftCode(data);
              }}
              onIsValidChange={handleIsValidChange}
            />
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
