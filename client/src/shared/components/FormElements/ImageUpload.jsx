import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [previewUrl, setPreviewUrl] = useState();
  const [isDragging, setIsDragging] = useState(false);

  const filePickerRef = useRef();

  // Object URLs are cheaper than base64 data URLs; free the old one when it changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fileHandler = (pickedFile) => {
    if (!pickedFile || !pickedFile.type.startsWith("image/")) {
      return;
    }
    setPreviewUrl(URL.createObjectURL(pickedFile));
    props.onInput(props.id, pickedFile, true);
  };

  const pickedHandler = (event) => {
    if (event.target.files && event.target.files.length === 1) {
      fileHandler(event.target.files[0]);
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const dragOverHandler = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const dropHandler = (event) => {
    event.preventDefault();
    setIsDragging(false);
    fileHandler(event.dataTransfer.files[0]);
  };

  return (
    <div className="form-control">
      <span className="image-upload__label">{props.label || "Image"}</span>
      <input
        id={props.id}
        ref={filePickerRef}
        className="image-upload__input"
        type="file"
        accept=".jpg,.png,.jpeg,.webp"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center ? "center" : ""}`}>
        <button
          type="button"
          className={`image-upload__preview ${
            isDragging ? "image-upload__preview--active" : ""
          } ${props.round ? "image-upload__preview--round" : ""}`}
          onClick={pickImageHandler}
          onDragOver={dragOverHandler}
          onDragLeave={() => setIsDragging(false)}
          onDrop={dropHandler}
          aria-label={previewUrl ? "Change image" : "Pick an image"}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            <span className="image-upload__placeholder">
              <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
                <path
                  d="M4 16l4.6-4.6a2 2 0 012.8 0L16 16m-2-2l1.6-1.6a2 2 0 012.8 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Click or drop an image
            </span>
          )}
        </button>
        <Button size="small" inverse onClick={pickImageHandler}>
          {previewUrl ? "Change image" : "Pick image"}
        </Button>
      </div>
      {!previewUrl && <p className="image-upload__hint">{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
