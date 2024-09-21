const mongoose = require("mongoose");
const Decimal128 = mongoose.Types.Decimal128;

const userschema = mongoose.Schema({
  senderAccountNumber: {
    type: String,
    required: true,
  },
  RecipientName: {
    type: String,
    required: true,
  },
  RecipeintBank: {
    type: String,
    required: true,
  },
  RecipientAccountNumber: {
    type: String,
    required: true,
  },
  TransferAmount: {
    type: Decimal128,
    required: true,
  },
  Currency: {
    type: String,
    required: true,
  },
  SwiftCode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Transaction", transactionschema);
