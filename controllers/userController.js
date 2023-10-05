const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Regsiter new user
// route POST /api/v1/user/register
//access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All Fields are required!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("Email already registered!");
  }

  // Hashed Password
  const hashedPass = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPass,
  });

  if (user) {
    res.status(201).json({
      data: { _id: user.id, email: user.email, username: user.username },
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid!");
  }
});

// login  user
// route POST /api/v1/user/login
//access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All Fields are required!");
  }
  const user = await User.findOne({ email });

  // compare pass with hashed pass
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign({
        user:{
            username: user.username,
            email: user.email,
            id: user.id
        }
    }, process.env.JWT_SECRET_KEY,
    {expiresIn: '60 days'});
    res.status(200).json({ accessToken: accessToken });
  }
  else{
    res.status(400);
    throw new Error("Email or password is not vaild !");
  }
});

// get current user
// route get /api/v1/user/profile
//access private

const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json({ data: req.user });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
