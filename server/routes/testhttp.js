const express = require("express");
const router = express.Router();
const User = require("../models/user");
const checkauth = require("../check-auth");

router.get("/", (req, res) => {
  User.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
