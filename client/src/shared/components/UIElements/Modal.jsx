import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import "./Modal.css";

// Built on the native <dialog> element, which gives us focus trapping,
// Escape-to-close and top-layer stacking for free
const ModalOverlay = (props) => {
  const dialogRef = useRef(null);
  const titleId = useId();
  const { onCancel } = props;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const cancelHandler = (event) => {
    event.preventDefault();
    if (onCancel) onCancel();
  };

  // The dialog itself has no padding, so a click whose target is the dialog
  // element landed on the ::backdrop
  const backdropClickHandler = (event) => {
    if (event.target === event.currentTarget && onCancel) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${props.className || ""}`}
      style={props.style}
      aria-labelledby={titleId}
      onCancel={cancelHandler}
      onClick={backdropClickHandler}
    >
      <div className="modal__inner">
        <header className={`modal__header ${props.headerClass || ""}`}>
          <h2 id={titleId}>{props.header}</h2>
          {onCancel && (
            <button
              type="button"
              className="modal__close"
              aria-label="Close"
              onClick={onCancel}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </header>
        <form
          onSubmit={
            props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
          }
        >
          <div className={`modal__content ${props.contentClass || ""}`}>
            {props.children}
          </div>
          {props.footer && (
            <footer className={`modal__footer ${props.footerClass || ""}`}>
              {props.footer}
            </footer>
          )}
        </form>
      </div>
    </dialog>
  );
};

const Modal = (props) => {
  if (!props.show) {
    return null;
  }
  return createPortal(
    <ModalOverlay {...props} />,
    document.getElementById("modal-hook")
  );
};

export default Modal;
