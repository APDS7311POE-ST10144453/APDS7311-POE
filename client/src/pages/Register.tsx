import React, { useRef } from "react";
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

export default function Register() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
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
      console.log("User register attempt, data passed: ", data);
      const response = await fetch("https://localhost:3000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setResponseMessage("User registered successfully");
        console.log("Redirecting to /login");
        // wait a second before redirect
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login
        }, 2000);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Registration failed");
      }
    } catch (error) {
      console.error("An error occurred, please try again later.", error);
      setErrorMessage("An error occurred, please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image"></div>

      <div className="login-form">
        <div className="form-container">
          <form onSubmit={registerUser}>
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
              <text className="global-error-text">{errors["name"]}</text>
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
              <text className="global-error-text">{errors["username"]}</text>
            </div>
            <div className="form-group-horizontal">
              <div className="form-group">
                <label>ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  placeholder="10 Digit ZA ID Number"
                  value={data.idNumber}
                  onChange={handleChange}
                  className="input-field"
                />
                <text className="global-error-text">{errors["idNumber"]}</text>
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
                  {errors["accountNumber"]}
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
                <text className="global-error-text">{errors["password"]}</text>
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
                  {errors["confirmPassword"]}
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
