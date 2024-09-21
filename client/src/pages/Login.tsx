import React from "react";
import "../css/LoginAndRegister.css";
import { useState } from "react";

export default function Login() {
  const [data, setData] = useState({
    username: "",
    accountNumber: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    console.log("User Logged in");

    // Fetch the login API endpoint
    // Fetch the login API endpoint
    try {
      const response = await fetch("https://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User logged in successfully", result);
        setSuccessMessage("Login successful!");
        localStorage.setItem("token", result.token);
        console.log("Redirecting to /customer-dashboard");
        window.location.href = "/customer-dashboard"; // Redirect to customer dashboard
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred, please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        {/* Add your image here */}
        <img src="your-image-url.jpg" alt="Login" />
      </div>

      <div className="login-form">
        <form onSubmit={loginUser}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Your Username"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              placeholder="Your Account Number"
              value={data.accountNumber}
              onChange={(e) =>
                setData({ ...data, accountNumber: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </div>
    </div>
  );
}