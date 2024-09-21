import React from "react";
import { useState } from "react";
import "../css/Register.css";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    username: "",
    idNumber: "",
    accountNumber: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Registration failed");
      }
    } catch (error) {
      // Handle the error here
      console.error("An error occurred., please try again later., ", error);
      setErrorMessage("An error occurred, please try again later.");
    }
  };

  return (
    <div>
      <form onSubmit={registerUser}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Smith"
            value={data.name}
            onChange={handleChange}
            className="form-control"
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
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>ID Number</label>
          <input
            type="text"
            name="idNumber"
            placeholder="10 Digit ZA ID Number"
            value={data.idNumber}
            onChange={handleChange}
            className="form-control"
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
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {responseMessage && <p className="success-message">{responseMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}
