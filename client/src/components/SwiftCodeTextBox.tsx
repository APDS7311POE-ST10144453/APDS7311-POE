import React, { useState } from "react";
import ErrorTextBox from "./ErrorTextBox";
import "../css/SwiftCodeTextBox.css";
import { Logger } from "../utils/logger";
// Define interface for API response
interface SwiftCodeResponse {
  bank_name: string;
  [key: string]: string; // Allow other properties
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const API_KEY = import.meta.env.VITE_SWIFT_CODE_VALIDATOR_API_KEY;

/**
 * SwiftCodeTextBox component is a React functional component that provides a text box for entering and validating SWIFT codes.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.value - The current value of the SWIFT code input.
 * @param {(value: string) => void} props.onChange - Callback function to handle changes to the SWIFT code input.
 * @param {(isValid: boolean) => void} props.onIsValidChange - Callback function to handle changes to the validity state of the SWIFT code.
 * 
 * @returns {JSX.Element} The rendered SwiftCodeTextBox component.
 * 
 * @component
 * 
 * @example
 * <SwiftCodeTextBox
 *   value={swiftCode}
 *   onChange={handleSwiftCodeChange}
 *   onIsValidChange={handleIsValidChange}
 * />
 * 
 * @remarks
 * This component validates the SWIFT code format and makes an API call to fetch the bank name associated with the SWIFT code.
 * It displays appropriate error messages and loading indicators based on the validation and API call results.
 */
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      const logger = new Logger();
      logger.error(`SWIFT code validation failed: ${errorMessage}`);
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
