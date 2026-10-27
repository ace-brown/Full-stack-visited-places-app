import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Map from "./Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { BACKEND_URL, assetUrl } from "../../shared/util/config";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);

    try {
      await sendRequest(`${BACKEND_URL}/places/${props.id}`, "DELETE", null, {
        Authorization: "Bearer " + auth.token,
      });
      props.onDelete(props.id);
    } catch (err) {}
  };

  const isOwner = auth.userId === props.creatorId;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <Map center={props.coordinates} title={`Map of ${props.address}`} />
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Delete this place?"
        footer={
          <React.Fragment>
            <Button ghost onClick={cancelDeleteHandler} autoFocus>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>
          &ldquo;{props.title}&rdquo; will be permanently deleted. This can't be
          undone.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={assetUrl(props.image)}
              alt={props.title}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <p className="place-item__address">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                  fill="currentColor"
                />
              </svg>
              {props.address}
            </p>
            <p className="place-item__description">{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button size="small" inverse onClick={openMapHandler}>
              View on map
            </Button>
            {isOwner && (
              <div className="place-item__owner-actions">
                <Button size="small" ghost to={`/places/${props.id}`}>
                  Edit
                </Button>
                <Button size="small" danger onClick={showDeleteWarningHandler}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
