import React from "react";
import { createPortal } from "react-dom";

import "./SideDrawer.css";

const SideDrawer = (props) => {
  if (!props.show) {
    return null;
  }
  return createPortal(
    <aside className="side-drawer" onClick={props.onClick}>
      {props.children}
    </aside>,
    document.getElementById("drawer-hook")
  );
};

export default SideDrawer;
