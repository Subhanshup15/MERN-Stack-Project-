import React, { useState } from "react";
import validator from "validator";
import "./App.css";

const App = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (value) => {
    if (
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setErrorMessage("Is Strong Password");
    } else {
      setErrorMessage("Is Not Strong Password");
    }
  };

  return (
    <div className="container">
      <h2>Checking Password Strength in ReactJS</h2>
      <label htmlFor="password">Enter Password:</label>
      <input
        id="password"
        type="text"
        onChange={(e) => validate(e.target.value)}
      />
      {errorMessage && (
        <span
          className={`message ${
            errorMessage === "Is Strong Password" ? "strong" : "weak"
          }`}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default App;
