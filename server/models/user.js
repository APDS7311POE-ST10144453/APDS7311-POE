const mongoose = require("mongoose");
const { Decimal128 } = mongoose.Types;

const userschema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordSalt: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "employee"],
    default: "customer",
  },
  balance: {
    type: Decimal128,
    required: false,
  },
  accountLookupHash: {
    type: String,
    required: false,
    index: true
  },
});

module.exports = mongoose.model("User", userschema);

