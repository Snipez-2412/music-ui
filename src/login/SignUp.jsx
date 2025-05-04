import React, { useState } from "react";
import "./Signup.css";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Simulate existing registered users
  const existingUsernames = ["user1", "admin", "johnDoe"];

  const validateUsername = () => {
    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
    } else if (existingUsernames.includes(username)) {
      setUsernameError("Username already exists.");
    } else {
      setUsernameError("");
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email.trim()) {
      setEmailError("Email cannot be empty.");
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format (must be @gmail.com).");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!password) {
      setPasswordError("Password cannot be empty.");
    } else if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character.");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSignUp = () => {
    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirmPassword();

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      return;
    }

    alert("Sign-up successful!");
    window.location.href = "login.html";
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <div className="input-group">
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={validateUsername}
          />
          {usernameError && <p className="error-message">{usernameError}</p>}
        </div>
        <div className="input-group">
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>
        <div className="input-group">
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
          />
          <p className="note">
            Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character.
          </p>
          {passwordError && <p className="error-message">{passwordError}</p>}
        </div>
        <div className="input-group">
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={validateConfirmPassword}
          />
          {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
        </div>
        <button className="signup-btn" onClick={handleSignUp}>
          Sign Up
        </button>
        <div className="login">
          <p>
            Already have an account? <a href="login.html">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
