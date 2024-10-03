const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();
const {encrypt} = require("./helpers/encryption");

const employees = [
  {
    username: "employee1",
    name: "Employee One",
    idNumber: "1234567890",
    accountNumber: "1234567890",
    password: "password1",
    role: "employee",
  },
  {
    username: "employee2",
    name: "Employee Two",
    idNumber: "0987654321",
    accountNumber: "0987654321",
    password: "password2",
    role: "employee",
  },
];

async function seedEmployees() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
    });

    for (const employee of employees) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(employee.password, 10);

      // Encrypt the idNumber and accountNumber
      const encryptedIdNumber = encrypt(employee.idNumber);
      const encryptedAccountNumber = encrypt(employee.accountNumber);

      

      // Create the employee with hashed password and encrypted fields
      await User.create({
        username: employee.username,
        name: employee.name,
        idNumber: encryptedIdNumber,
        accountNumber: encryptedAccountNumber,
        password: hashedPassword,
        role: employee.role,
      });
    }

    console.log("Employees seeded successfully");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding employees:", error);
  }
}

seedEmployees();
