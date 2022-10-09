const uuid = require("uuid");

const HttpError = require("../models/http-error");

DUMMY_USERS = [
  {
    id: "u1",
    name: "John",
    email: "John@yahoo.com",
    password: "john123",
  },
];

const getUsers = (req, res) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res) => {
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

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
