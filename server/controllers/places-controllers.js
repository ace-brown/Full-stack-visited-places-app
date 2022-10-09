const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const uuid = require("uuid");

const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Santorini",
    description: "Santorini is one of the Cyclades islands in the Aegean Sea.",
    imageUrl:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
    address: "Caldera-Akrotiri, Thira 827 01, Greece",
    location: {
      lat: 36.393154,
      lng: 25.46151,
    },
    creator: "u1",
  },
];

// Getting place based on their ID
const getPlaceById = (req, res) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("Could not find the place for the provided id!", 404);
  }

  res.json({ place });
};

// Getting places based on the User ID
const getPlacesByUserId = (req, res) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((p) => {
    return userId === p.creator;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find the places for the provided user id!", 404)
    );
  }

  res.json({ places });
};

// Create place
const createPlace = async (req, res, next) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data!", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

// Update place
const updatePlace = (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data!", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

// Delete place
const deletePlace = (req, res) => {
  const placeId = req.params.body;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find the place with this id!", 404);
  }
  const DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Deleted Item!" });
};

// Exports
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
