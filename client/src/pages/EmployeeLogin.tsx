import React from 'react';
import '../css/LoginAndRegister.css';

function EmployeeLogin() {
    return (
        <div className="login-container">
            <div className="login-image">
                {/* Add your image here */}
                <img src="your-image-url.jpg" alt="Login" />
            </div>

            <div className="login-form">
                <form>
                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" name="username" />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" name="password" />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default EmployeeLogin;