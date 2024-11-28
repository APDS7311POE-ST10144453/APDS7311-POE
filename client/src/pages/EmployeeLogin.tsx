import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginAndRegister.css';

interface LoginData {
  username: string;
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
 * EmployeeLogin component handles the login functionality for employees.
 * 
 * This component provides a form for employees to enter their username and password,
 * and handles the login process by sending a POST request to the server.
 * 
 * @returns {JSX.Element} The rendered login form component.
 * 
 * @component
 * 
 * @example
 * // Usage example:
 * <EmployeeLogin />
 * 
 * @remarks
 * - Uses `useNavigate` from `react-router-dom` to navigate to the employee dashboard upon successful login.
 * - Stores the received token in localStorage.
 * - Displays success and error messages based on the login response.
 * 
 * @function
 * 
 * @typedef {Object} LoginData
 * @property {string} username - The username of the employee.
 * @property {string} password - The password of the employee.
 * 
 * @typedef {Object} LoginResponse
 * @property {string} token - The authentication token received upon successful login.
 * 
 * @typedef {Object} ErrorResponse
 * @property {string} message - The error message received upon failed login.
 */
function EmployeeLogin(): JSX.Element {
  const navigate = useNavigate();
  const [data, setData] = useState<LoginData>({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:3000/api/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json() as LoginResponse;
        if (result.token && result.token.length > 0) {
          localStorage.setItem('token', result.token);
          setSuccessMessage('Employee logged in successfully');
          navigate('/employee-dashboard');
        }
      } else {
        const error = await response.json() as ErrorResponse;
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
          <form onSubmit={(e) => {
            void loginUser(e);
          }}>
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