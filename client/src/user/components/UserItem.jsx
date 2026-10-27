import React from "react";
import { Link } from "react-router-dom";

import "./UserItem.css";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import { assetUrl } from "../../shared/util/config";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={assetUrl(props.image)} alt="" width={64} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <span className="user-item__count">
              {props.placeCount} {props.placeCount === 1 ? "place" : "places"}
            </span>
          </div>
          <svg
            className="user-item__arrow"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
