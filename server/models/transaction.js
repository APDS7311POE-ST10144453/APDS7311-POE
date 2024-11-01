const mongoose = require("mongoose");
const Decimal128 = mongoose.Types.Decimal128;

const transactionSchema = mongoose.Schema({
  senderAccountNumber: {
    type: String,
    required: true,
  },
  senderLookupHash: {
    type: String,
    required: true,
    index: true,
  },
  recipientName: {
    type: String,
    required: true,
  },
  recipientBank: {
    type: String,
    required: true,
  },
  recipientAccountNumber: {
    type: String,
    required: true,
  },
  recipientLookupHash: {
    type: String,
    required: true,
    index: true,
  },
  transferAmount: {
    type: Decimal128,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  swiftCode: {
    type: String,
    required: true,
  },
  transactionDescription: {
    type: String,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "denied", "completed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
