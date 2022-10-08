const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
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

router.get("/:pid", (req, res) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new Error("Could not find the place for the provided id!", 404);
  }

  res.json({ place });
});

router.get("/user/:uid", (req, res) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((u) => {
    return userId === u.creator;
  });

  if (!place) {
    next(new Error("Could not find the place for the provided user id!", 404));
  }

  res.json({ place });
});

module.exports = router;
