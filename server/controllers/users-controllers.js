const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

// Getting users =======================================================
const getUsers = async (req, res, next) => {
  // Only send name and email of users, and not data like password
  let users;
  try {
    users = User.findAll();
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later!",
      500
    );
    return next(error);
  }

  res.json({ users });
};

// Signup ==============================================================
const signup = async (req, res, next) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.file) {
    return next(
      new HttpError("Invalid inputs passed, please check your data!", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = User.findByEmail(email);
  } catch (err) {
    const error = new HttpError("Something went wrong, signup failed!", 500);
    return next(error);
  }

  // Sending an error if the email already exists
  if (existingUser) {
    const error = new HttpError("Email already exists, please login!", 422);
    return next(error);
  }

  // Hashing the user's password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  // Creating user
  let createdUser;
  try {
    createdUser = User.create({
      name,
      email,
      image: req.file.path.replace(/\\/g, "/"),
      password: hashedPassword,
    });
  } catch (err) {
    const error = new HttpError("Signup failed, please try again later!", 500);
    return next(error);
  }

  // Tokenizing the credentials
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signup failed, please try again later!", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

// Login ===============================================================
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Email validation
  let existingUser;
  try {
    existingUser = User.findByEmail(email);
  } catch (err) {
    const error = new HttpError("Something went wrong, logging in failed!", 500);
    return next(error);
  }

  // Checking email existance
  if (!existingUser) {
    const error = new HttpError(
      "Credentials seem to be wrong, could not log you in",
      401
    );
    return next(error);
  }

  // Checking valid password
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Credentials seem to be wrong, could not log you in",
      401
    );
    return next(error);
  }

  // Tokenizing the credentials
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later!",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

// Exports
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
