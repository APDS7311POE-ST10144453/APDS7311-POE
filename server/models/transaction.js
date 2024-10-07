const mongoose = require("mongoose");
const Decimal128 = mongoose.Types.Decimal128;

const transactionSchema = mongoose.Schema({
  senderAccountNumber: {
    type: String,
    required: true,
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
  TransactionDate: {
    type: Date,
    required: true,
  },
  TransactionDescription: {
    type: String,
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ["approved", "pending", "denied"],
    default: "pending",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
