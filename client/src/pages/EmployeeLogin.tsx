import React, { useState } from 'react';
import '../css/LoginAndRegister.css';

function EmployeeLogin() {
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('Employee login attempt, data passed: ', data);
      const response = await fetch('https://localhost:3000/api/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        localStorage.setItem('token', result.token);
        console.log("Token after login:", localStorage.getItem("token"));
        setSuccessMessage('Employee logged in successfully');
        console.log("Redirecting to /employee-dashboard");
        window.location.href = "/employee-dashboard"; // Redirect to employee dashboard
      } else {
        const error = await response.json();
        setErrorMessage(error.message || 'Login failed');
      }
    } catch (error) {
      console.error('An error occurred, please try again later.', error);
      setErrorMessage('An error occurred, please try again later.');
    }
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
                autoComplete="username"
                value={data.username}
                onChange={handleChange}
                className="input-field login-input-field"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={data.password}
                onChange={handleChange}
                className="input-field login-input-field"
              />
            </div>
            <button type="submit">Login</button>
          </form>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default EmployeeLogin;