const uuid = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

DUMMY_USERS = [
  {
    id: "u1",
    name: "John",
    email: "John@yahoo.com",
    password: "john123",
  },
];

// Getting users
const getUsers = (req, res) => {
  res.json({ users: DUMMY_USERS });
};

// Signup
const signup = (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data!", 422);
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.password === password);
  if (hasUser) {
    throw new HttpError("Could not create user, emial already exist!", 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

// Login
const login = (req, res) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not find the user, credentials seem to be wrong!",
      401
    );
  }

  res.status(200).json({ message: "Loged in!" });
};

// Exports
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
