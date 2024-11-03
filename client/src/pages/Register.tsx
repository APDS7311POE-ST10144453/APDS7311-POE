import { useState } from "react";
import "../css/LoginAndRegister.css"; // Using the same CSS for both login and register
import useFormValidationErrors from "../validation/useFormValidationErrors";
import {
  getAccountNumberErrors,
  getConfirmPasswordErrors,
  getIdNumberErrors,
  getNameErrors,
  getPasswordErrors,
  getUsernameErrors,
} from "../validation/validation";

/**
 * Register component handles the user registration form.
 * It includes form fields for name, username, ID number, account number, password, and confirm password.
 * It performs client-side validation before submitting the form data to the server.
 *
 * @returns {JSX.Element} The Register component.
 *
 * @component
 *
 * @example
 * return (
 *   <Register />
 * )
 *
 * @remarks
 * This component uses a custom hook `useFormValidationErrors` for managing form validation errors.
 * It also handles the form submission and displays success or error messages based on the server response.
 *
 * @function
 * @name Register
 *
 * @typedef {Object} FormData
 * @property {string} name - The full name of the user.
 * @property {string} username - The username of the user.
 * @property {string} idNumber - The ID number of the user.
 * @property {string} accountNumber - The account number of the user.
 * @property {string} password - The password of the user.
 * @property {string} confirmPassword - The confirmation of the password.
 *
 * @typedef {Object} ValidationErrors
 * @property {string[]} name - Validation errors for the name field.
 * @property {string[]} username - Validation errors for the username field.
 * @property {string[]} idNumber - Validation errors for the ID number field.
 * @property {string[]} accountNumber - Validation errors for the account number field.
 * @property {string[]} password - Validation errors for the password field.
 * @property {string[]} confirmPassword - Validation errors for the confirm password field.
 *
 * @typedef {Object} ServerResponse
 * @property {string} message - The response message from the server.
 *
 * @typedef {Object} ServerError
 * @property {string} message - The error message from the server.
 *
 * @hook
 * @name useFormValidationErrors
 * @param {string[]} fields - The list of fields to validate.
 * @returns {Object} The validation errors and functions to set and clear errors.
 *
 * @function
 * @name handleChange
 * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input field.
 * @returns {void}
 *
 * @function
 * @name registerUser
 * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
 * @returns {Promise<void>}
 */
export default function Register(): JSX.Element {
  const [data, setData] = useState({
    name: "",
    username: "",
    idNumber: "",
    accountNumber: "",
    password: "",
    confirmPassword: "",
  });

  // custom hook for error validation
  const { errors, setFieldError, clearFieldError } = useFormValidationErrors([
    "name",
    "username",
    "idNumber",
    "accountNumber",
    "password",
    "confirmPassword",
  ]);

  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const registerUser = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validation
    clearFieldError("name"); // Full Name
    const nameErrors = getNameErrors(data.name);
    if (nameErrors.length > 0) {
      setFieldError("name", nameErrors);
      return;
    }
    clearFieldError("username"); // Username
    const usernameErrors = getUsernameErrors(data.username);
    if (usernameErrors.length > 0) {
      setFieldError("username", usernameErrors);
      return;
    }
    clearFieldError("idNumber"); // ID Number
    const idNumberErrors = getIdNumberErrors(data.idNumber);
    if (idNumberErrors.length > 0) {
      setFieldError("idNumber", idNumberErrors);
      return;
    }
    clearFieldError("accountNumber"); // Account Number
    const accountNumberErrors = getAccountNumberErrors(data.accountNumber);
    if (accountNumberErrors.length > 0) {
      setFieldError("accountNumber", accountNumberErrors);
      return;
    }
    clearFieldError("password"); // Password
    const passwordErrors = getPasswordErrors(data.password);
    if (passwordErrors.length > 0) {
      setFieldError("password", passwordErrors);
      return;
    }
    clearFieldError("confirmPassword"); // Confirm Password
    const confirmPasswordErrors = getConfirmPasswordErrors(
      data.password,
      data.confirmPassword
    );
    if (confirmPasswordErrors.length > 0) {
      setFieldError("confirmPassword", confirmPasswordErrors);
      return;
    }

    try {
      const response = await fetch("https://localhost:3000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = (await response.json()) as { message: string };
        setResponseMessage(result.message);
        // wait a second before redirect
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login
        }, 2000);
      } else {
        const error = (await response.json()) as { message: string };
        setErrorMessage(error.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred, please try again later.";
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image"></div>

      <div className="login-form">
        <div className="form-container">
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
              void registerUser(e);
            }}
          >
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Smith"
                value={data.name}
                onChange={handleChange}
                className="input-field"
              />
              <text className="global-error-text">{errors.name}</text>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Your Username"
                value={data.username}
                onChange={handleChange}
                className="input-field"
              />
              <text className="global-error-text">{errors.username}</text>
            </div>
            <div className="form-group-horizontal">
              <div className="form-group">
                <label>ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  placeholder="13 Digit ZA ID Number"
                  value={data.idNumber}
                  onChange={handleChange}
                  className="input-field"
                />
                <text className="global-error-text">{errors.idNumber}</text>
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Your Account Number"
                  value={data.accountNumber}
                  onChange={handleChange}
                  className="input-field"
                />
                <text className="global-error-text">
                  {errors.accountNumber}
                </text>
              </div>
            </div>
            <div className="form-group-horizontal">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  className="input-field"
                />
                <text className="global-error-text">{errors.password}</text>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                />
                <text className="global-error-text">
                  {errors.confirmPassword}
                </text>
              </div>
            </div>
            <button type="submit">Register</button>
          </form>
          {responseMessage && <p className="success">{responseMessage}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}
