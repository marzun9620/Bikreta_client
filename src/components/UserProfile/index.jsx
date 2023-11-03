// ProfileViewer.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import styles from "./ProfileViewer.module.css"; // Import your CSS module
const ProfileViewer = () => {
  const userId = "6536a09386508680a8798c72"; // Replace with the actual user ID
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user information based on the userId
    // Replace this with your actual API endpoint
    axios
      .get(`http://localhost:3000/api/api/user/${userId}`)
      .then((response) => {
        setUser(response.data);
      });
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Implement the logic to save user edits here
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    // Implement the logic to cancel edits and revert to the original data here
    setIsEditing(false);
  };

  return (
    <div>
      <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
      />
      <div className={styles.profileViewer}>
        {user ? (
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                <img
                  src={user.profilePhoto.url}
                  alt={user.fullName}
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.profileHeaderInfo}>
                <h1 className={styles.profileName}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={user.fullName}
                      onChange={(e) =>
                        setUser({ ...user, fullName: e.target.value })
                      }
                    />
                  ) : (
                    user.fullName
                  )}
                </h1>
                <p className={styles.profileShopName}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={user.shopName}
                      onChange={(e) =>
                        setUser({ ...user, shopName: e.target.value })
                      }
                    />
                  ) : (
                    user.shopName
                  )}
                </p>
              </div>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.contactDetail}>
                <span className={styles.detailLabel}>Email:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                ) : (
                  <span className={styles.detailValue}>{user.email}</span>
                )}
              </div>
              <div className={styles.contactDetail}>
                <span className={styles.detailLabel}>Phone:</span>
                <span className={styles.detailValue}>98979989898</span>
              </div>
            </div>
            {isEditing ? (
              <div className={styles.editButtons}>
                <button className={styles.saveButton} onClick={handleSaveClick}>
                  Save
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button className={styles.editButton} onClick={handleEditClick}>
                Edit Profile
              </button>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ProfileViewer;
