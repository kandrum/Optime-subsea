import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./style/Contentstyle.module.css"; // Ensure the path to your styles is correct
import { useNavigate } from "react-router-dom";
const Content = () => {
  return (
    <div>
      <p>i am content</p>
    </div>
  );
};

export default Content;
