const https = require("https");
const fs = require("fs");
const path = require("path");
const app = require("./app"); // Import the app from app.js
const port = process.env.PORT || 3000;

// Read the certificate and key files
const options = {
  key: fs.readFileSync(path.join(__dirname, "keys", "privatekey.pem")),
  cert: fs.readFileSync(path.join(__dirname, "keys", "certificate.pem")),
};

// Create HTTPS server
https.createServer(options, app).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Server is running on https://localhost:" +port);
});
