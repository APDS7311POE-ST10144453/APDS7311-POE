import React, { useState } from "react";
import ErrorTextBox from "./ErrorTextBox";
import "../css/SwiftCodeTextBox.css";
const API_KEY = "CcES+jV4ZAnevw2ULFMBiw==O5erOBpo9XDXEGFT";

const SwiftCodeTextBox: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bankName, setBankName] = useState<string>("");

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const swiftCode = e.target.value;
    setInputValue(swiftCode);
    setHasError(false); // Reset error state on input change
    setIsValid(false);
    setBankName(""); // Reset bank name

    if (!swiftCode.trim()) {
      setHasError(true); // If input is empty, show error
      return;
    }

    setLoading(true);

    try {
      // Use fetch to call the API for SWIFT code validation
      const response = await fetch(`https://api.api-ninjas.com/v1/swiftcode?swift=${swiftCode}`, {
        headers: {
          "X-Api-Key": API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("SWIFT code data:", data);
        // If the response data indicates a valid SWIFT code, set the error state accordingly
        if (data && data.length > 0) {
          setHasError(false);
          setIsValid(true); // Set valid SWIFT code
          setBankName(data[0].bank_name);
        } else {
          setHasError(true);
          setIsValid(false); // Invalid SWIFT code
        }
      } else {
        setHasError(true);
        setIsValid(false);
      }
    } catch (error) {
      console.error("Error fetching SWIFT code data:", error);
      setHasError(true);
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ErrorTextBox value={inputValue} onChange={handleInputChange} error={hasError} />
      {loading && <p className="loading-message">Validating SWIFT code...</p>}
      {hasError && <p className="error-message">Please enter a valid SWIFT code</p>}
      {isValid && <p className="success-message">SWIFT code for {bankName} is valid!</p>}
    </div>
  );
};

export default SwiftCodeTextBox;
