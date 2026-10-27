const crypto = require("crypto");

const db = require("../util/db");

// `places` is returned as an array of place ids, matching the API's response shape
const toUser = (row) =>
  row && {
    id: row.id,
    name: row.name,
    email: row.email,
    image: row.image,
    places: JSON.parse(row.places),
  };

const PLACES_COLUMN =
  "(SELECT json_group_array(p.id) FROM places p WHERE p.creator = u.id) AS places";

const findAllStmt = db.prepare(
  `SELECT u.id, u.name, u.email, u.image, ${PLACES_COLUMN} FROM users u ORDER BY u.rowid`
);
const findByEmailStmt = db.prepare("SELECT * FROM users WHERE email = ?");
const existsStmt = db.prepare("SELECT 1 FROM users WHERE id = ?");
const insertStmt = db.prepare(
  "INSERT INTO users (id, name, email, password, image) VALUES (?, ?, ?, ?, ?)"
);

exports.findAll = () => findAllStmt.all().map(toUser);

// Includes the password hash, for login checks only
exports.findByEmail = (email) => findByEmailStmt.get(email);

exports.exists = (id) => !!existsStmt.get(id);

exports.create = ({ name, email, password, image }) => {
  const id = crypto.randomUUID();
  insertStmt.run(id, name, email, password, image);
  return { id, name, email, image, places: [] };
};
