/**
 * Validates the name field for length and SQL injection.
 *
 * @param {string} name - The name to validate.
 * @returns {string[]} - An array of error messages, if any.
 */
export function getNameErrors(name: string): string[] {
  const errors: string[] = [];
  // name must be greater than 3 but less than 50
  const nameLengthRegex = /^.{4,49}$/;

  // Validating for SQL injection
  if (validateSQLInjection(name)) {
    errors.push(getSQLInjectionError("Field"));
  } else if (!nameLengthRegex.test(name)) {
    errors.push("This field must contain more than 3 characters");
  }
  return errors;
}

/**
 * Validates the username field for presence and SQL injection.
 *
 * @param {string} username - The username to validate.
 * @returns {string[]} - An array of error messages, if any.
 */
export function getUsernameErrors(username: string): string[] {
  const errors: string[] = [];

  if (username === "") {
    errors.push("Please enter a username");
  } else if (validateSQLInjection(username)) {
    errors.push(getSQLInjectionError("Username"));
  }
  return errors;
}

/**
 * Validates the South African ID number for format and SQL injection.
 *
 * @param {string} idNumber - The ID number to validate.
 * @returns {string[]} - An array of error messages, if any.
 */
export function getIdNumberErrors(idNumber: string): string[] {
  const errors: string[] = [];
  const idFormatRegex =
    /^\d{2}(\d[1-9]|1[0-2])(\d[1-9]|[12]\d|3[01])\d{4}[01]\d\d$/;

  if (idNumber === "") {
    errors.push("Please enter your SA ID number");
  } else if (validateSQLInjection(idNumber)) {
    errors.push(getSQLInjectionError("ID Number"));
  } else if (!idFormatRegex.test(idNumber)) {
    errors.push("ID number is in an incorrect format");
  }
  return errors;
}

/**
 * Validates the account number for length, digit-only content, and SQL injection.
 *
 * @param {string} accountNumber - The account number to validate.
 * @returns {string[]} - An array of error messages, if any.
 */
export function getAccountNumberErrors(accountNumber: string): string[] {
  const errors: string[] = [];
  const allDigitsRegex = /^\d+$/;

  if (accountNumber === "") {
    errors.push("Please enter an Account Number");
  } else if (validateSQLInjection(accountNumber)) {
    errors.push(getSQLInjectionError("Account Number"));
  } else if (accountNumber.length != 10) {
    errors.push("Account number must be 10 characters in length");
  } else if (!allDigitsRegex.test(accountNumber)) {
    errors.push("Account number must only contain digits");
  }
  return errors;
}

/**
 * Validates the password for complexity requirements and SQL injection.
 *
 * @param {string} password - The password to validate.
 * @returns {string[]} - An array of error messages, if any.
 */
export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];
  const passwordComplexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
  // Validating for SQL injection
  if (validateSQLInjection(password)) {
    errors.push(getSQLInjectionError("Password"));
  } else if (!passwordComplexityRegex.test(password)) {
    errors.push(`
      Passwords must contain contain: 
      at least 8 characters, one capital letter, one lowercase letter, one digit, and one special character`);
  }
  return errors;
}

/**
 * Validates that confirm password matches the password and checks for SQL injection.
 *
 * @param {string} password - The original password.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {string[]} - An array of error messages, if any.
 */
export function getConfirmPasswordErrors(
  password: string,
  confirmPassword: string
): string[] {
  const errors: string[] = [];
  if (confirmPassword === "") {
    errors.push("Confirm Password cannot be empty");
  } else if (validateSQLInjection(confirmPassword)) {
    errors.push(getSQLInjectionError(confirmPassword));
  } else if (confirmPassword != password) {
    errors.push("Passwords do not match");
  }
  return errors;
}

/**
 * Validates the transfer amount for format and SQL injection.
 *
 * @param {string} amount - The amount to validate.
 * @returns {string[]} - An array of error messages, if any.
 */
export function getTransferAmountErrors(amount: string): string[] {
  const errors: string[] = [];
  const amountFormatRegex = /^\d+(\.\d{0,2})?$/;
  if (amount === "") {
    errors.push("Transfer amount cannot be empty");
  } else if (validateSQLInjection(amount)) {
    errors.push(getSQLInjectionError("Transfer Amount"));
  } else if (!amountFormatRegex.test(amount)) {
    errors.push("Transfer amount is in an incorrect format");
  }
  return errors;
}

/**
 * Validates the description field for presence and SQL injection.
 *
 * @param {string} description - The description to validate.
 * @returns {string[]} - An array of error messages, if any.
 */
export function getDescriptionErrors(description: string): string[] {
  const errors: string[] = [];
  if (description === "") {
    errors.push("Please enter a description");
  } else if (validateSQLInjection(description)) {
    errors.push(getSQLInjectionError("Description"));
  }

  return errors;
}

/**
 * Generates a standardized SQL injection error message for a given field.
 *
 * @param {string} fieldName - The field name for the error message.
 * @returns {string} - The SQL injection error message.
 */
function getSQLInjectionError(fieldName: string): string {
  return `
    ${fieldName} invalid: Please refrain from using the following terms and symbols\n
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'EXEC', 'UNION', 'WHERE', --, ;`;
}

/**
 * Checks if a string contains SQL injection patterns.
 *
 * @param {string} input - The input to check.
 * @returns {boolean} - True if SQL injection patterns are found; otherwise, false.
 */
function validateSQLInjection(input: string): boolean {
  const sqlInjectionRegex =
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|WHERE)\b|;|--/i;

  if (!sqlInjectionRegex.test(input)) {
    return false;
  }
  return true;
}
