import React from "react";
import { createPortal } from "react-dom";

import "./Backdrop.css";

const Backdrop = (props) => {
  return createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById("backdrop-hook")
  );
};

export default Backdrop;
