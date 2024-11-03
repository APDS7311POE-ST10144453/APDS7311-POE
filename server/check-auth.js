const jwt = require('jsonwebtoken');
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