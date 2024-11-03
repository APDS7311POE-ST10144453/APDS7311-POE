import React, { useState } from "react";
import ErrorTextBox from "./ErrorTextBox";
import "../css/SwiftCodeTextBox.css";

// Define interface for API response
interface SwiftCodeResponse {
  bank_name: string;
  [key: string]: string; // Allow other properties
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const API_KEY = import.meta.env.VITE_SWIFT_CODE_VALIDATOR_API_KEY;

const SwiftCodeTextBox: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onIsValidChange: (isValid: boolean) => void;
}> = ({ value, onChange, onIsValidChange }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bankName, setBankName] = useState<string>("");

  // Basic SWIFT code format validation
  const isValidSwiftFormat = (swift: string): boolean => {
    const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    return swiftRegex.test(swift);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const swiftCode = e.target.value.toUpperCase(); // Convert to uppercase
    onChange(swiftCode);
    setHasError(false);
    setBankName("");

    // Don't make API call unless we have at least 8 characters
    if (swiftCode.length < 8) {
      setHasError(true);
      onIsValidChange(false);
      return;
    }

    // Check format before making API call
    if (!isValidSwiftFormat(swiftCode)) {
      setHasError(true);
      onIsValidChange(false);
      return;
    }

    setLoading(true);

    try {
      const url = `https://api.api-ninjas.com/v1/swiftcode?swift=${swiftCode}`;
      const response = await fetch(url, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/strict-boolean-expressions
          "X-Api-Key": API_KEY || "",
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const data = await response.json() as SwiftCodeResponse[];
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
        if (data && data.length > 0) {
          setHasError(false);
          onIsValidChange(true);
          setBankName(data[0].bank_name);
        } else {
          setHasError(true);
          onIsValidChange(false);
          setBankName("");
        }
      } else {
        setHasError(true);
        onIsValidChange(false);
        setBankName("");
      }
    } catch (error) {
      console.error("Error fetching SWIFT code data:", error);
      setHasError(true);
      onIsValidChange(false);
      setBankName("");
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (): string => {
    if (!value) return "Please enter a SWIFT code";
    if (value.length < 8) return "SWIFT code must be at least 8 characters";
    if (!isValidSwiftFormat(value)) return "Invalid SWIFT code format";
    if (hasError) return "Invalid SWIFT code";
    return "";
  };

  return (
    <div>
      <ErrorTextBox 
        value={value} 
        onChange={(e) => void handleInputChange(e)} 
        error={hasError} 
      />
      {loading && <p className="loading-message">Validating SWIFT code...</p>}
      {hasError && <p className="error-message">{getErrorMessage()}</p>}
      {!hasError && bankName && (
        <p className="success-message">SWIFT code for {bankName} is valid!</p>
      )}
    </div>
  );
};

export default SwiftCodeTextBox;
