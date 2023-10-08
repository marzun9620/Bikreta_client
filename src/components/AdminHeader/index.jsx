import axios from "axios";
import React, { useState } from "react";
import styles from "./styles.module.css";

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [categoryDescription, setCategoryDescription] = useState("");
  const openModal = (modalName) => {
    setActiveModal(modalName);
    setSidebarOpen(false); // Close the sidebar whenever a modal is opened
  };

  const closeModal = () => {
    setActiveModal(null);
  };
  const handleAddCategory = async () => {
    try {
      // Assuming your backend is set up to accept POST requests for adding categories
      // Replace '/api/categories' with your specific endpoint
      const response = await axios.post("/erp/add/categories", {
        name: categoryName,
        description: categoryDescription,
      });

      if (response.status === 200) {
        console.log("Category added successfully:", response.data);
        setCategoryName("");
        setCategoryDescription("");
        setShowSuccessPopup(true); // Set the success popup to true
        setTimeout(() => setShowSuccessPopup(false), 3000); // Auto hide after 3 seconds
        closeModal();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div>
      {showSuccessPopup && (
        <div className={styles.successPopup}>Category added successfully!</div>
      )}

      <nav className={styles.navbar}>
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={styles.menuBtn}
        >
          ☰
        </button>

        <span className={styles.navbarBrand}>Bikreta Admin</span>

        <div className={styles.quickLinks}>
          <a href="#dashboard">Dashboard</a>
          <a href="#analytics">Analytics</a>
          <a href="#feedback">Feedback</a>
        </div>

        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search..."
          />
          <button className={styles.searchBtn}>🔍</button>
        </div>

        <div className={styles.navItems}>
          {/*
          <div className={styles.messageDropdown}>
            <button className={styles.messageBtn}>📩</button>
            <div className={styles.messageMenu}>
              <a href="#message1">Message 1</a>
              <a href="#message2">Message 2</a>
              <a href="#message3">Message 3</a>
            </div>
          </div>
  */}

          <div className={styles.userDropdown}>
            <span className={styles.userName}>John Doe</span>
            <div className={styles.userMenu}>
              <a href="#profile">Profile</a>
              <a href="#settings">Settings</a>
              <a href="#logout">Logout</a>
            </div>
          </div>

          <button className={styles.notificationBtn}>🔔</button>
        </div>

        <a href="#support" className={styles.supportLink}>
          Support
        </a>
      </nav>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div
          className={
            isSidebarOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar
          }
        >
          <h2>Admin Panel</h2>
          <button onClick={() => openModal("dashboard")}>Dashboard</button>
          <button onClick={() => openModal("dashboard")}>Add a catagory</button>
          <button onClick={() => openModal("dashboard")}>Dashboard</button>
          <button onClick={() => openModal("dashboard")}>Dashboard</button>
        </div>
      </div>

      {activeModal === "dashboard" && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <h2>Add Category</h2>
            <form>
              <div className={styles.formGroup}>
                <label>Name:</label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                ></textarea>
              </div>
              <button type="button" onClick={handleAddCategory}>
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
