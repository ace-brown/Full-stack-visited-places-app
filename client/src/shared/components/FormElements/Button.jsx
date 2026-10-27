import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  const className = [
    "button",
    `button--${props.size || "default"}`,
    props.inverse && "button--inverse",
    props.danger && "button--danger",
    props.ghost && "button--ghost",
    props.className,
  ]
    .filter(Boolean)
    .join(" ");

  if (props.href) {
    return (
      <a className={className} href={props.href}>
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link to={props.to} className={className}>
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={className}
      type={props.type || "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      autoFocus={props.autoFocus}
    >
      {props.children}
    </button>
  );
};

export default Button;
