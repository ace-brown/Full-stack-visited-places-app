const crypto = require("crypto");

const db = require("../util/db");

const toPlace = (row) =>
  row && {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    address: row.address,
    location: { lat: row.lat, lng: row.lng },
    creator: row.creator,
  };

const findByIdStmt = db.prepare("SELECT * FROM places WHERE id = ?");
const findByCreatorStmt = db.prepare(
  "SELECT * FROM places WHERE creator = ? ORDER BY rowid"
);
const insertStmt = db.prepare(
  `INSERT INTO places (id, title, description, image, address, lat, lng, creator)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);
const updateStmt = db.prepare(
  "UPDATE places SET title = ?, description = ? WHERE id = ?"
);
const deleteStmt = db.prepare("DELETE FROM places WHERE id = ?");

exports.findById = (id) => toPlace(findByIdStmt.get(id));

exports.findByCreator = (userId) =>
  findByCreatorStmt.all(userId).map(toPlace);

exports.create = ({ title, description, image, address, location, creator }) => {
  const id = crypto.randomUUID();
  insertStmt.run(
    id,
    title,
    description,
    image,
    address,
    location.lat,
    location.lng,
    creator
  );
  return exports.findById(id);
};

exports.update = (id, { title, description }) => {
  updateStmt.run(title, description, id);
  return exports.findById(id);
};

exports.remove = (id) => {
  deleteStmt.run(id);
};
