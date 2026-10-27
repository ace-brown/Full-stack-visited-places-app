import React from "react";

import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <div
      className={props.asOverlay ? "loading-spinner__overlay" : undefined}
      role="status"
      aria-label="Loading"
    >
      <div className="loading-spinner" />
    </div>
  );
};

export default LoadingSpinner;
