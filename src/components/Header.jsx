import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFillCartCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ userName, userId, cartItemCount }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    fetchSearchResults(query);
  };

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/product/cart/count/${userId}`)
        .then((response) => setCartCount(response.data.count))
        .catch((error) => console.error("Error fetching cart count:", error));
    }
  }, [userId]);

  const fetchSearchResults = async (query) => {
    if (query.length >= 1) {
      let productEndpoint = `http://localhost:3000/api/products/search?q=${query}`;
      let categoryEndpoint = `http://localhost:3000/api/products/category/${query.toLowerCase()}`;

      // Execute both API calls simultaneously
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          axios.get(productEndpoint),
          axios.get(categoryEndpoint),
        ]);

        // Combine results from both calls
        const combinedResults = [
          ...productResponse.data,
          ...categoryResponse.data,
        ];
        setSearchResults(combinedResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className={styles.menuButton}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
        <Link to="/home" className={styles.logo}>
          BIKRETA
        </Link>
      </div>

      <aside className={`${styles.sidebar} ${showSidebar ? styles.show : ""}`}>
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
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </div>

        {/* Search Results Dropdown */}
        <div className={styles.searchResults}>
          {searchResults.map((product) => (
            <Link
              to={`/product/${product._id}`}
              className={styles.productLink}
              key={product._id}
            >
              {product.name}
            </Link>
          ))}
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
