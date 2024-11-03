const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();
const {encrypt} = require("./helpers/encryption");
const { hashPassword } = require("./helpers/passwordHelper");

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

// Add MongoDB client options
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

async function seedEmployees() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, clientOptions);

    for (const employee of employees) {
      // Hash the password
      const { salt, hash } = await hashPassword(employee.password);

      // Encrypt the idNumber and accountNumber
      const encryptedIdNumber = encrypt(employee.idNumber);
      const encryptedAccountNumber = encrypt(employee.accountNumber);

      // Create the employee with hashed password and encrypted fields
      await User.create({
        username: employee.username,
        name: employee.name,
        idNumber: encryptedIdNumber,
        accountNumber: encryptedAccountNumber,
        password: hash,
        passwordSalt: salt,
        role: employee.role,
      });
    }
    // eslint-disable-next-line no-console
    console.log("Employees seeded successfully");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding employees:", error);
    mongoose.disconnect();
  }
}

seedEmployees();
