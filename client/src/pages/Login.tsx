import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginAndRegister.css";
import { Logger } from "../utils/logger";

interface LoginData {
  username: string;
  accountNumber: string;
  password: string;
}

interface LoginResponse {
  token: string;
  message?: string;
}

interface ErrorResponse {
  message: string;
}

/**
 * Login component for user authentication.
 *
 * @returns {JSX.Element} The rendered login component.
 *
 * This component handles user login by capturing username, account number, and password.
 * It sends a POST request to the server for authentication and handles the response.
 *
 * @component
 *
 * @example
 * return (
 *   <Login />
 * )
 *
 * @remarks
 * - Uses `useNavigate` from `react-router-dom` for navigation.
 * - Uses `useState` for managing form data and messages.
 * - Displays success or error messages based on the login response.
 *
 * @function
 * @name Login
 */
export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const [data, setData] = useState<LoginData>({
    username: "",
    accountNumber: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      const response = await fetch("https://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = (await response.json()) as LoginResponse;
        if (result.token && result.token.length > 0) {
          localStorage.setItem("token", result.token);
          setSuccessMessage("User logged in successfully");
          navigate("/customer-dashboard");
        } else {
          throw new Error("Invalid token received");
        }
      } else {
        const error = (await response.json()) as ErrorResponse;
        setErrorMessage(error.message || "Login failed");
      }
    } catch (error) {
      const logger = new Logger();
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      logger.error(`Login failed: ${errorMessage}`);
      setErrorMessage(`An error occurred: ${errorMessage}`);
    }
  };

  const handleEmployeeLoginClick = (): void => {
    navigate("/employee-login");
  };

  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className="login-form">
        <div className="form-container">
          <form onSubmit={(e) => void loginUser(e)}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Your Username"
                value={data.username}
                onChange={handleChange}
                className="input-field login-input-field"
              />
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                placeholder="Your Account Number"
                value={data.accountNumber}
                onChange={handleChange}
                className="input-field login-input-field"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="input-field login-input-field"
              />
            </div>
            <button type="submit">Login</button>
          </form>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <button
            className="employeeLogin-button"
            type="button"
            onClick={handleEmployeeLoginClick}
          >
            Employee Login
          </button>
        </div>
      </div>
    </div>
  );
}
