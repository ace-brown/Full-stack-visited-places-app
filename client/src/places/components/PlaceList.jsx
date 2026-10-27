import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <Card className="empty-state">
        <h2>No places yet</h2>
        {props.isOwner ? (
          <React.Fragment>
            <p>Share the first place you have visited.</p>
            <Button to="/places/new">Share a place</Button>
          </React.Fragment>
        ) : (
          <p>This traveler hasn't shared any places yet.</p>
        )}
      </Card>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
