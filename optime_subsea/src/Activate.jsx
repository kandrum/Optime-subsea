import React, { useEffect, useState } from "react";
import styles from "./style/Activate.module.css";
import { ip } from "./appconstants";
import loginGif from "./lofingif.gif";
export default function Activate() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(""); // State to store server message

  useEffect(() => {
    fetch(`${ip}/getallusers`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const toggleIsActive = (userid) => {
    // Find the current state of the user to toggle
    const user = users.find((user) => user.userid === userid);
    if (!user) return;

    const newIsActive = user.isActive === "Y" ? "N" : "Y";

    fetch(`${ip}/updateActivation`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid, isActive: newIsActive }),
    })
      .then((response) => {
        if (response.ok) {
          // Check if response status is 2xx
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        setMessage(data.message, "for", userid);

        // Optimistically update the UI to reflect the change
        const updatedUsers = users.map((user) => {
          if (user.userid === userid) {
            return { ...user, isActive: newIsActive };
          }
          return user;
        });

        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error updating user activation:", error);
        setMessage("Failed to update user activation.");
      });
  };

  return (
    <div>
      {/* Display server message */}
      {message && <p>{message}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>userid</th>
            <th>username</th>
            <th>role</th>
            <th>isActivate</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userid}>
              <td>{user.userid}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => toggleIsActive(user.userid)}>
                  {user.isActive === "Y" ? "Active" : "Inactive"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
