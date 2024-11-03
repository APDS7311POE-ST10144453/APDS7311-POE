require("./helpers/checkEnv");

const express = require("express");
const app = express();
const urlprefix = "/api";
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const cert = fs.readFileSync("keys/certificate.pem");
const options = {
  sslCA: cert,
};

const connstring = process.env.CONNECTION_STRING;

mongoose.set("debug", true);

mongoose
  .connect(connstring)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  }, options);

app.use(
  cors({
    origin: [
      "https://localhost:3000",
      "https://localhost:5173",
      "https://localhost:5173/api",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        imgSrc: ["'self'", "https://localhost:3000"],
      },
    },
  })
);

app.use(express.json());

app.get(urlprefix + "/", (req, res) => {
  res.send("Hey, you managed to run a get from the API!");
});

// Insert routes here
const userRoutes = require("./routes/user");
app.use(urlprefix + "/user", userRoutes);

const transactionRoutes = require("./routes/transaction");
app.use(urlprefix + "/transaction", transactionRoutes);

module.exports = app;
