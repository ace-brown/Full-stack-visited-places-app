import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const showError = !inputState.isValid && inputState.isTouched;
  const errorId = `${props.id}-error`;

  const sharedProps = {
    id: props.id,
    placeholder: props.placeholder,
    autoComplete: props.autoComplete,
    onChange: changeHandler,
    onBlur: touchHandler,
    value: inputState.value,
    "aria-invalid": showError,
    "aria-describedby": showError ? errorId : undefined,
  };

  const element =
    props.element === "input" ? (
      <input type={props.type} {...sharedProps} />
    ) : (
      <textarea rows={props.rows || 4} {...sharedProps} />
    );

  return (
    <div className={`form-control ${showError ? "form-control--invalid" : ""}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {showError && (
        <p className="form-control__error" id={errorId}>
          {props.errorText}
        </p>
      )}
    </div>
  );
};

export default Input;
