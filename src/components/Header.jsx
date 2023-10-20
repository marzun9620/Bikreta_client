import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BsFillCartCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

import "leaflet/dist/leaflet.css";

const Header = ({ userName, userId }) => {
  const BASE_URL = "http://localhost:3000";
  const [data, setData] = useState({
    fullName: "",
    shopName: "",
    email: "",
    password: "",
    districts: "",
    thana: "",
    houseNo: "",
    profilePhoto: null,
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("login"); // 'login' or 'signup'
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const districts = ["Dhaka", "Chittagong", "Sylhet", "Barisal"]; // Sample districts
  const thanas = ["Thana1", "Thana2", "Thana3"]; // Sample thanas

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "profilePhoto") {
      setData({ ...data, [e.target.name]: e.target.files[0] });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };
  const handleLoginChange = ({ currentTarget: input }) => {
    setLoginData({ ...loginData, [input.name]: input.value });
  };
  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (let key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    }

    //console.log(data[0]);
    //console.log(formData[0]);
    const endpoint = `${BASE_URL}/api/user`; // If you have a BASE_URL variable elsewhere
    try {
      const res = await axios.post(endpoint, formData); // Using the endpoint variable

      setLoading(false);
      alert(res.data.message);
    } catch (error) {
      console.error("Error:", error.response.data); // Log the error for more detailed info
      setLoading(false);
      alert("Error adding user. Please try again.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = "http://localhost:3000/api/auth";
      const { data: res } = await axios.post(url, loginData);

      localStorage.setItem("token", res.data);
      localStorage.setItem("userName", res.userName);
      localStorage.setItem("userId", res.userId);
      console.log(res.body);
      window.location = "/productlist";
    } catch (error) {
    } finally {
      setLoading(false); // Ensure loading is set to false in case of both success and error
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
      let productEndpoint = `http://localhost:3000/erp/products/search?q=${query}`;
      let categoryEndpoint = `http://localhost:3000/erp/categories/search?q=${query.toLowerCase()}`;

      try {
        const [productResponse, categoryResponse] = await Promise.all([
          axios.get(productEndpoint),
          axios.get(categoryEndpoint),
        ]);

        const combinedResults = [
          ...productResponse.data,
          ...categoryResponse.data.map((category) => ({
            categoryName: category.name,
          })),
        ];
        setSearchResults(combinedResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <div
            onClick={() => setShowSidebar(!showSidebar)}
            className={styles.menuButton}
          ></div>
          <Link to="/ProductList" className={styles.productLink1}>
            BIKRETA
          </Link>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search for products or categories..."
              onChange={handleSearchChange}
              value={searchTerm}
            />
          </div>

          {/* Search Results Dropdown */}
          <div className={styles.searchResults}>
            {searchResults.map((item) => {
              // If it's a product
              if (item._id) {
                return (
                  <Link
                    to={`/product/${item._id}`}
                    className={styles.productLink}
                    key={item._id}
                  >
                    <img
                      src={`http://localhost:3000/api/products/image/${item._id}`}
                      alt={item.name}
                      className={styles.searchResultImage}
                    />
                    <span>{item.productName}</span>

                    <span>৳{item.unitPrice}</span>
                  </Link>
                );
              }
              // If it's a category
              return (
                <Link
                  to={`/category/${item.categoryName}`}
                  className={styles.categoryLink}
                  key={item.name}
                >
                  {item.categoryName}{" "}
                  <span className={styles.categoryLabel}>Category</span>
                </Link>
              );
            })}
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
            <span className={styles.userNameDropdown} onClick={toggleDropdown}>
              Hello, {userName}
              {isOpen && (
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
              )}
            </span>
            <Link to="/cart" className={styles.cart}>
              <BsFillCartCheckFill className={styles.cartIcon} />
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </Link>
            <div className={styles.notifications}>
              <span className={styles.bellIcon}>🔔</span>
              <span className={styles.notificationCount}>3</span>
            </div>
          </div>
        ) : (
          <div className={styles.loggedOut}>
            <button
              onClick={() => {
                setShowModal(true);
                setModalType("login");
              }}
              className={styles.loginBtn}
            >
              Login
            </button>
            <button
              onClick={() => {
                setShowModal(true);
                setModalType("signup");
              }}
              className={styles.signUpBtn}
            >
              Sign Up
            </button>
          </div>
        )}
      </header>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h1>BIKRETA</h1>
            <button onClick={closeModal} className={styles.closeModalButton}>
              &times;
            </button>
            {modalType === "login" && (
              <div className={styles.loginForm}>
                <h2>Login</h2>
                <label htmlFor="email">Email:</label>
                <input
                  type="text"
                  name="email"
                  onChange={handleLoginChange}
                  placeholder="Enter your email"
                  required
                  // Assuming you'd want to bind this to a state variable
                  // onChange={e => setLoginEmail(e.target.value)}
                />
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                  // Assuming you'd want to bind this to a state variable
                  // onChange={e => setLoginPassword(e.target.value)}
                />
                <button
                  type="submit"
                  onClick={handleLoginSubmit}
                  // onClick={handleLogin}
                >
                  Login
                </button>
                {loading && (
                  <>
                    <div className={styles.loaderBackground}></div>
                    <div className={styles.loader}></div>
                  </>
                )}{" "}
                {/* Loading spinner */}
              </div>
            )}

            {modalType === "signup" && (
              <div className={styles.signupForm}>
                <h2>Sign Up</h2>
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  name="fullName"
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
                <label htmlFor="shopName">Shop Name:</label>
                <input
                  type="text"
                  placeholder="Shop Name"
                  name="shopName"
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
                <label htmlFor="password"> Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
                <div
                  style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
                >
                  <select
                    name="districts"
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>

                  <select
                    name="thana"
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="">Select Thana</option>
                    {thanas.map((thana) => (
                      <option key={thana} value={thana}>
                        {thana}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    name="houseNo"
                    onChange={handleChange}
                    placeholder="House No"
                    className={styles.input}
                  />
                </div>
                <label htmlFor="profilePhoto"> Profile Photo:</label>
                <input
                  type="file"
                  name="profilePhoto"
                  onChange={handleChange}
                  className={styles.input}
                />
                <button
                  type="submit"
                  onClick={handleSubmit}
                  // onClick={handleSignup}
                >
                  Sign Up
                </button>
                {loading && (
                  <>
                    <div className={styles.loaderBackground}></div>
                    <div className={styles.loader}></div>
                  </>
                )}{" "}
                {/* Loading spinner */}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
