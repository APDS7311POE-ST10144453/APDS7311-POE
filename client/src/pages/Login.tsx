import React from "react";
import "../css/Login.css";
import { useState } from "react";

//After registering,
//customers need to log on to the website by providing their username, account number and
//password.

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

    //Fetch the login API endpoint
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
        //Store JWT token in local storage
        localStorage.setItem("token", result.token);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred, please try again later.");
    }
  };

  return (
    <div>
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
  );
}
