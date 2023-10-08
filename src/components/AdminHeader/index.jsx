import axios from "axios";
import React, { useState } from "react";
import styles from "./styles.module.css";

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCategoryExistsPopup, setShowCategoryExistsPopup] = useState(false);
  const [categoryDescription, setCategoryDescription] = useState("");
  //-----------------------------------------------------------------------------------------------------
  //state var for adding products
  // State variables to manage product details
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [cartonSize, setCartonSize] = useState("");
  const [cartonStock, setCartonStock] = useState("");
  const [minStockThreshold, setMinStockThreshold] = useState("");
  const [category, setCategory] = useState("");

  //-------------------------------------------------------------------------------------------------------------
  const openModal = (modalName) => {
    setActiveModal(modalName);
    setSidebarOpen(false); // Close the sidebar whenever a modal is opened
  };

  const closeModal = () => {
    setActiveModal(null);
  };
  const BASE_URL = "http://localhost:3000";

  const handleAddCategory = async () => {
    const endpoint = `${BASE_URL}/erp/add/catagory`;

    const categoryData = {
      name: categoryName,
      description: categoryDescription,
    };
    try {
      const response = await axios.post(endpoint, categoryData);

      // Handle 200 and 201 status codes
      console.log("Category added successfully:", response.data);
      setCategoryName("");
      setCategoryDescription("");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      closeModal();
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        setCategoryName("");
        setCategoryDescription("");
        setShowCategoryExistsPopup(true);
        console.log(1);
        setTimeout(() => setShowCategoryExistsPopup(false), 3000);
        closeModal();
      } else {
        console.error(
          "Error adding category:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleAddProduct = () => {
    // API call to add product goes here
  };

  return (
    <div>
      {showSuccessPopup && (
        <div className={styles.successPopup}>Category added successfully!</div>
      )}

      {showCategoryExistsPopup && (
        <div className={styles.errorModal}>
          <p>Category already exists!</p>
        </div>
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
          <h2>Most Trusted ERP Solution</h2>
          <button onClick={() => openModal("dashboard")}>Add a catagory</button>
          <button onClick={() => openModal("addProduct")}>Add Products</button>
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

      {activeModal === "addProduct" && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <h2>Add Product</h2>
            <form>
              <div className={styles.formGroup}>
                <label>Product Name:</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Unit Price:</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Carton Size:</label>
                <input
                  type="number"
                  value={cartonSize}
                  onChange={(e) => setCartonSize(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Carton Stock:</label>
                <input
                  type="number"
                  value={cartonStock}
                  onChange={(e) => setCartonStock(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Minimum Stock Threshold:</label>
                <input
                  type="number"
                  value={minStockThreshold}
                  onChange={(e) => setMinStockThreshold(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category:</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <button type="button" onClick={handleAddProduct}>
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
