import { useState } from "react";

function useFormValidationErrors(fields: string[]) {
  // Initialize the errors object state dynamically based on the fields array
  const [errors, setErrors] = useState<{ [key: string]: string[] }>(
    fields.reduce((acc, field) => {
      acc[field] = [];
      return acc;
    }, {} as { [key: string]: string[] })
  );

  // Function to set (overwrite) error messages for a specific field
  const setFieldError = (fieldName: string, errorMessages: string[]) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessages,
    }));
  };

  // Function to clear error messages for a specific field
  const clearFieldError = (fieldName: string) => {
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
