const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

// Getting users =======================================================
const getUsers = async (req, res, next) => {
  // Only send name and email of users, and not data like password
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later!",
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// Signup ==============================================================
const signup = async (req, res, next) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data!", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, signup failed!", 500);
    return next(error);
  }

  // Sending an error if the email already exists
  if (existingUser) {
    const error = new HttpError("Email already exists, please login!", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed, please try agian later!", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

// Login ===============================================================
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Email validation
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, loging in failed!", 500);
    return next(error);
  }

  // Checking wheather email or pass is correct
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Credentials seem to be wrong, could not log you in",
      401
    );
    return next(error);
  }

  res.status(200).json({ message: "Loged in!" });
};

// Exports
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
