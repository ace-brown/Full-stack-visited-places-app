import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

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
  {
    id: "p2",
    title: "Santorini",
    description: "Santorini is one of the Cyclades islands in the Aegean Sea.",
    imageUrl:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
    address: "Caldera-Akrotiri, Thira 827 01, Greece",
    location: {
      lat: 36.393154,
      lng: 25.46151,
    },
    creator: "u2",
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
