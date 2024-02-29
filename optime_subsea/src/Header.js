// Header.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebarVisibility } from "./redux/actions/uiAction";
import user from "./user.png";
import styles from "./style/Headerstyle.module.css"; // Adjust the import path as needed

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);

  console.log("Header", userType);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const goToRegister = () => {
    if (userType.result.role === "admin") {
      navigate("/register");
    } else {
      alert("You do not have access to Register user");
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    dispatch(toggleSidebarVisibility());
  };

  return (
    <div className={styles.headerContainer}>
      <button onClick={toggleSidebar} className={styles.menuButton}>
        ☰
      </button>
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
            <button onClick={goToRegister} className={styles.dropdownLink}>
              Register
            </button>
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
