import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { BACKEND_URL } from "../../shared/util/config";

const UserPlaces = () => {
  const auth = useContext(AuthContext);
  const [loaded, setLoaded] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;
  const isOwner = auth.userId === userId;
  // Ignore places of the previously viewed user while the new ones load
  const loadedPlaces = loaded && loaded.userId === userId ? loaded.places : null;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${BACKEND_URL}/places/user/${userId}`
        );
        setLoaded({ userId, places: responseData.places });
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const deletedPlaceHandler = useCallback((deletedPlaceId) => {
    setLoaded((prevLoaded) => ({
      ...prevLoaded,
      places: prevLoaded.places.filter((place) => place.id !== deletedPlaceId),
    }));
  }, []);

  return (
    <div className="page">
      <ErrorModal error={error} onClear={clearError} />
      <div className="page__header">
        <div>
          <h1 className="page__title">{isOwner ? "My places" : "Places"}</h1>
          {loadedPlaces && (
            <p className="page__subtitle">
              {loadedPlaces.length}{" "}
              {loadedPlaces.length === 1 ? "place" : "places"} shared
            </p>
          )}
        </div>
        {isOwner && loadedPlaces && loadedPlaces.length > 0 && (
          <Button to="/places/new">Add place</Button>
        )}
      </div>
      {isLoading && !loadedPlaces && (
        <div className="center page-loading">
          <LoadingSpinner />
        </div>
      )}
      {loadedPlaces && (
        <PlaceList
          items={loadedPlaces}
          isOwner={isOwner}
          onDeletePlace={deletedPlaceHandler}
        />
      )}
    </div>
  );
};

export default UserPlaces;
