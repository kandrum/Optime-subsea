// Header.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import user from "./user.png";
import styles from "./style/Headerstyle.module.css"; // Adjust the import path as needed

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>Data-Visualization optime subsea </h1>
      <div className={styles.relative}>
        <button onClick={toggleDropdown} className={styles.userButton}>
          <img src={user} alt="avatar" className={styles.userAvatar} />
        </button>
        {isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            <a href="#" className={styles.dropdownLink}>
              Settings
            </a>
            <a href="#" className={styles.dropdownLink}>
              Help
            </a>
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
