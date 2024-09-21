import React, { useState } from "react";
import ErrorTextBox from "./ErrorTextBox";
import "../css/SwiftCodeTextBox.css";

const SwiftCodeTextBox: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setHasError(e.target.value.trim() === ""); // Example: Required field check
  };

  return (
    <div>
      <label htmlFor="myInput">Example Textbox:</label>
      <ErrorTextBox value={inputValue} onChange={handleInputChange} error={hasError} />
      {hasError && <p className="error-message">Please enter a value.</p>}
    </div>
  );
};

export default SwiftCodeTextBox;
