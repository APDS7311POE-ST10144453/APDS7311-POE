import { useState } from "react";

/**
 * Custom hook to manage validation errors for form fields.
 *
 * Initializes an error object with each field in the provided fields array
 * and provides functions to set or clear error messages for specific fields.
 *
 * @param {string[]} fields - Array of field names for which validation errors are managed.
 * @returns {{
 *   errors: Record<string, string[]>,
 *   setFieldError: (fieldName: string, errorMessages: string[]) => void,
 *   clearFieldError: (fieldName: string) => void
 * }} - An object containing current errors and functions to update them.
 */
function useFormValidationErrors(fields: string[]): {
  errors: Record<string, string[]>;
  setFieldError: (fieldName: string, errorMessages: string[]) => void;
  clearFieldError: (fieldName: string) => void;
} {
  // Initialize the errors object state dynamically based on the fields array
  const [errors, setErrors] = useState<Record<string, string[]>>(
    fields.reduce<Record<string, string[]>>((acc, field) => {
      acc[field] = [];
      return acc;
    }, {})
  );

  // Function to set (overwrite) error messages for a specific field
  const setFieldError = (fieldName: string, errorMessages: string[]): void => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessages,
    }));
  };

  // Function to clear error messages for a specific field
  const clearFieldError = (fieldName: string): void => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: [],
    }));
  };

  // Return the current errors and the functions to modify them
  return {
    errors,
    setFieldError,
    clearFieldError,
  };
}

export default useFormValidationErrors;
