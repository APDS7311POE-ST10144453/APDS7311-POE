import React, { useState } from "react";
import "../css/LoginAndRegister.css";

export default function Login() {
  const [data, setData] = useState({
    username: "",
    accountNumber: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log("User login attempt, data passed: ", data);
      const response = await fetch("https://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        localStorage.setItem("token", result.token);

        setSuccessMessage("User logged in successfully");
        console.log("Redirecting to /customer-dashboard");
        window.location.href = "/customer-dashboard"; // Redirect to customer dashboard
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Login failed");
      }
    } catch (error) {
      console.error("An error occurred, please try again later.", error);
      setErrorMessage("An error occurred, please try again later.");
    }
  };

  const handleEmployeeLoginClick = () => {
    console.log("Redirecting to /employee-login");
    window.location.href = "/employee-login"; // Redirect to employee login
  };

  return (
    <div className="login-container">
      <div className="login-image">
      </div>

      <div className="login-form">
        <div className="form-container">
          <form onSubmit={loginUser}>
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
          <button className="employeeLogin-button" type="button" onClick={handleEmployeeLoginClick}>
            Employee Login
          </button>
        </div>
      </div>
    </div>
  );
}