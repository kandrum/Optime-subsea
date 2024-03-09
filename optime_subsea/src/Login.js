import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyUser } from "./redux/actions/VerifyAction";
import styles from "./style/Loginstyle.module.css";
import backgroundImage from "./style/Image2.png"; // Import the background image
import { ip } from "./appconstants";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Reset error message
    setErrorMessage("");

    try {
      const response = await fetch(`${ip}/logincheck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Handle non-200 responses, assume wrong credentials for simplicity
        setErrorMessage("Wrong credentials. Please try again.");
        return;
      }

      const data = await response.json();

      dispatch(verifyUser(data));

      if (data.result && data.result.checkstatus) {
        console.log("Login success from login component");
        navigate("/home");
      } else {
        // If checkstatus is false or not present, display an error message
        setErrorMessage("Wrong credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  // Inline style for the background image
  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  };

  const HandleRegister = () => {
    navigate("/register");
  };

  return (
    <div className={styles.container} style={containerStyle}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </label>
        <br />
        <label className={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </label>
        <br />
        {errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}{" "}
        {/* Display error message if any */}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>
            Login
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={HandleRegister}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
