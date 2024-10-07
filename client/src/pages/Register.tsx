import React, { useState } from "react";
import "../css/LoginAndRegister.css"; // Using the same CSS for both login and register

export default function Register() {
  const [data, setData] = useState({
    name: "",
    username: "",
    idNumber: "",
    accountNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setPasswordError(""); // Clear password error message when user starts typing
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      setPasswordError("Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character.");
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword()) {
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
                {passwordError && <div className="error-message">{passwordError}</div>}
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
