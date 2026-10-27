const express = require("express");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// Load server/.env if present (optional, Node >= 20.12)
try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch (err) {}

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const UPLOADS_DIR = path.join("uploads", "images");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const app = express();

app.disable("x-powered-by");

app.use(express.json());

// Uploaded file names are unique and never change, so they can be cached for long
app.use(
  "/uploads/images",
  express.static(UPLOADS_DIR, { maxAge: "30d", immutable: true })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
  throw new HttpError("Could not find the route", 404);
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.log(err);
    });
  }

  if (res.headersSent) {
    return next(error);
  }

  // Multer errors carry string codes (e.g. LIMIT_FILE_SIZE)
  const status = typeof error.code === "number" ? error.code : 500;
  const message =
    error.name === "MulterError"
      ? "Image upload failed: " + error.message
      : error.message || "An unknown error occurred!";

  res
    .status(error.name === "MulterError" ? 422 : status)
    .json({ message });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zo6mc77.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
