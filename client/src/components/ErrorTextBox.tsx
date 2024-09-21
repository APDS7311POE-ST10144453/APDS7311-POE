import React from "react";
import "../css/SwiftCodeTextBox.css"; // Import the external CSS file

// Define the props interface for the component
interface ErrorTextBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
}

const ErrorTextBox: React.FC<ErrorTextBoxProps> = ({ value, onChange, error }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`error-textbox ${error ? "error" : ""}`} // Apply "error" class when error is true
    />
  );
};

export default ErrorTextBox;
