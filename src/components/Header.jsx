import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { BsFillCartCheckFill } from 'react-icons/bs';

const Header = ({
  userName,
  userId,
  searchTerm,
  setSearchTerm,
  cartItemCount,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
};


  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/product/cart/count/${userId}`)
        .then((response) => setCartCount(response.data.count))
        .catch((error) => console.error("Error fetching cart count:", error));
    }
  }, [userId]);

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div onClick={() => setShowSidebar(!showSidebar)} className={styles.menuButton}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <Link to="/home" className={styles.logo}>BIKRETA</Link>
      </div>

      <aside className={`${styles.sidebar} ${showSidebar ? styles.show : ''}`}>
        <Link to="/category/electronics">Electronics</Link>
        <Link to="/category/clothing">Clothing</Link>
      </aside>

      <div className={styles.searchContainer}>
        <select
          className={styles.categoryDropdown}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search for products..."
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      </div>

      {userName ? (
        <div className={styles.loggedIn}>
          <span className={styles.primeLabel}>Prime</span>{" "}
          {/* Amazon Prime-like label */}
          <img
            src={`http://localhost:3000/api/user/photo/${userId}`}
            alt={userName}
            className={styles.userPhoto}
          />
          <span className={styles.userNameDropdown}>
            Hello, {userName}
            <div className={styles.dropdownContent}>
              <Link to="/profile">Profile</Link>
              <Link to="/orders">Order History</Link>
              <Link to="/settings">Settings</Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userName");
                  localStorage.removeItem("userId");
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </div>
          </span>
          <Link to="/cart" className={styles.cart}>
            <BsFillCartCheckFill className={styles.cartIcon} />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </Link>
          <div className={styles.notifications}>
            <span className={styles.bellIcon}>🔔</span>
            <span className={styles.notificationCount}>3</span>
          </div>
        </div>
      ) : (
        <div className={styles.loggedOut}>
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>
          <Link to="/signup" className={styles.signUpBtn}>
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;