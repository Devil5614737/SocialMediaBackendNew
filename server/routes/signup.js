const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const { username, email, password, pic } = req.body;
  const newUser = new User({
    username,
    email,
    password,
    pic,
  });

  const existedUser = await User.findOne({ email });
  if (existedUser) return res.status(400).send("user already registered");

  try {
    const salt = await bcrypt.genSalt(10);
    newUser.password=await bcrypt.hash(newUser.password, salt);
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
