const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

// Getting place by placeId ==========================================================
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the place!",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find the place for the provided id!",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

// Getting places by userId ==========================================================
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Ohh no! Could not find the place for the given id!",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find the places for the provided user id!", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

// Create place ======================================================================
const createPlace = async (req, res, next) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data!", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  // Adding coordinates
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // Creating place
  const createdPlace = new Place({
    title,
    description,
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
    address,
    location: coordinates,
    creator,
  });

  // Before saving place in db, check whether userId of creator already exists in db
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try agian later",
      500
    );
    return next(error);
  }

  // If the creator(user) is not in db we send this error
  if (!user) {
    const error = new HttpError(
      "Could not find the user for the provided id!",
      404
    );
    return next(error);
  }

  // Now that creator(user) exist, we can do two things:
  // 1-Saving place in db
  // 2-Add the placeId to the corresponding user document
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again!",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

// Update place =====================================================================
const updatePlace = async (req, res, next) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data!", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update data!",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the place!",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// Delete place =====================================================================
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the place!",
      500
    );
    return next(error);
  }

  // If we couldn't find a place by that id
  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  // Deleting from db
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Deletion process failed, could not delete the place!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted Item!" });
};

// Exports
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
