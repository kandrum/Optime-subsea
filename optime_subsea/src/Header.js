// Header.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import user from "./user.png";
import styles from "./style/Headerstyle.module.css"; // Adjust the import path as needed
import headerBackground from "./header.jpg";
function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userType, setuserType] = useState(
    useSelector((state) => state.userType.result.role)
  );
  const username = useSelector((state) => state.userType.result.username);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const goToLogin = () => {
    navigate("/");
  };
  const goToActivate = () => {
    navigate("/activate");
  };

  return (
    <div
      className={styles.headerContainer}
      style={{ backgroundImage: `url(${headerBackground})` }}
    >
      <h1 className={styles.headerTitle}>Welcome Back, {username} </h1>
      <div className={styles.relative}>
        <button onClick={toggleDropdown} className={styles.userButton}>
          <img src={user} alt="avatar" className={styles.userAvatar} />
        </button>
        {isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            {/* Render Activate button only for admin users */}
            {userType === "admin" && (
              <button onClick={goToActivate} className={styles.dropdownLink}>
                Activate
              </button>
            )}
            <button onClick={goToLogin} className={styles.dropdownLink}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
