import { useState } from "react";

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
