const mongoose = require("mongoose");

const userschema = mongoose.Schema({
});

module.exports = mongoose.model("Transaction", transactionschema);
