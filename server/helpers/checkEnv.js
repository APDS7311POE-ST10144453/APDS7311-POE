require('dotenv').config();
const crypto = require('crypto');

function checkEnvVariables() {
  const placeholders = {
    CONNECTION_STRING: "CONNECTION_STRING_HERE",
    JWT_SECRET: "JWT_SECRET_HERE",
    ENCRYPTION_KEY: "ENCRYPTION_KEY_HERE",
    MY_SECRET_PEPPER: "MY_SECRET_PEPPER_HERE",
    NODE_ENV: "NODE_ENV_HERE"
  };

  let invalidVars = [];

  for (const [key, placeholder] of Object.entries(placeholders)) {
    if (process.env[key] === placeholder) {
      invalidVars.push(key);
    }
  }

  if (invalidVars.length > 0) {
    console.log("The following environment variables are invalid or placeholders:");
    invalidVars.forEach(key => {
      console.log(`- ${key}`);
    });

    if (invalidVars.includes("CONNECTION_STRING")) {
      console.log("Please set a valid MongoDB connection string in the /server .env. You can get one from:");
      console.log("https://www.mongodb.com/cloud/atlas");
      console.log("Refer to the tutorial video attached to this submission for additional help")
    }

    if (invalidVars.includes("JWT_SECRET") || invalidVars.includes("ENCRYPTION_KEY") || invalidVars.includes("MY_SECRET_PEPPER")) {
      console.log("Please generate secure values for JWT_SECRET, ENCRYPTION_KEY, and MY_SECRET_PEPPER using the following command:");
      console.log("\nnode generatecrypto.js\n");
      console.log("Copy the generated values and paste them into the .env file");
    }

    if (invalidVars.includes("NODE_ENV")) {
      console.log("Please set a valid NODE_ENV value in the /server .env. It can be 'development' or 'production'.");
    }

    if(invalidVars.lenth>0){
        console.log("Refer to the tutorial video attached to this submission for additional help")
    }


    process.exit(1); // Exit the application with an error code
  } else {
    console.log("All environment variables are set correctly.");
  }
}

checkEnvVariables();

module.exports = checkEnvVariables;