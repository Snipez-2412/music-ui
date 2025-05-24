import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");

  const navigate = useNavigate();

  const validateUsername = () => {
    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/;
    if (!password) {
      setPasswordError("Password cannot be empty.");
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must include at least 1 uppercase letter and 1 number."
      );
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

  const handleSignUp = async () => {
    validateUsername();
    validatePassword();
    validateConfirmPassword();

    if (usernameError || passwordError || confirmPasswordError) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email: email || null,
          password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const createdUser = await response.json();
      alert("Sign-up successful!");
      console.log("Created user:", createdUser);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setSignupError(error.message);
    }
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
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
            Password must be at least 8 characters, include 1 uppercase letter,
            1 number, and 1 special character.
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
          {confirmPasswordError && (
            <p className="error-message">{confirmPasswordError}</p>
          )}
        </div>
        {signupError && <p className="error-message">{signupError}</p>}
        <button className="signup-btn" onClick={handleSignUp}>
          Sign Up
        </button>
        <div className="login">
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
