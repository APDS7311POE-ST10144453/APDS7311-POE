const jwt = require('jsonwebtoken');
/**
 * Middleware function to check authentication.
 * 
 * This function checks for the presence of an authorization header in the request.
 * If the header is present, it verifies the JWT token using the secret key.
 * If the token is valid, it attaches the decoded user information to the request object.
 * If the token is missing or invalid, it responds with a 401 status and an error message.
 * 
 * @returns {Function} Middleware function to handle authentication.
 */
const checkAuth = () => {
  return (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        throw new Error("Authentication token not found.");
      }
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
      req.user = { userId: decodedToken.userId };
      next();
    } catch (err) {
      res.status(401).json({ message: "Authentication failed: " + err.message });
    }
  };
};


module.exports = checkAuth;