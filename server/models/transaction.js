const mongoose = require("mongoose");
const Decimal128 = mongoose.Types.Decimal128;

/**
 * Transaction Schema
 * 
 * This schema defines the structure of a transaction document in the database.
 * 
 * @property {String} senderAccountNumber - The account number of the sender. Required.
 * @property {String} senderLookupHash - A hash used to lookup the sender. Required and indexed.
 * @property {String} recipientName - The name of the recipient. Required.
 * @property {String} recipientBank - The bank of the recipient. Required.
 * @property {String} recipientAccountNumber - The account number of the recipient. Required.
 * @property {String} recipientLookupHash - A hash used to lookup the recipient. Required and indexed.
 * @property {Decimal128} transferAmount - The amount to be transferred. Required.
 * @property {String} currency - The currency of the transfer amount. Required.
 * @property {String} swiftCode - The SWIFT code of the recipient's bank. Required.
 * @property {String} [transactionDescription] - A description of the transaction. Optional.
 * @property {Date} [transactionDate=Date.now] - The date of the transaction. Defaults to the current date and time.
 * @property {String} [approvalStatus="pending"] - The approval status of the transaction. Can be "pending", "approved", "denied", or "completed". Defaults to "pending".
 */
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
