const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res) => {
  const error = new HttpError("Could not find the route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error accured!" });
});

mongoose
  .connect(
    "mongodb+srv://fullstack_visited_place_app:TcZGruCxEqUCopik@cluster0.zo6mc77.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(app.listen(5000))
  .catch((err) => {
    console.log(err);
  });
