import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import styles from "./styles.module.css";

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    shopName:"",
    location:"",
    email: "",
    password: "",
    profilePhoto: null,
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Others"];

  // Handle change for input fields and file input
  const handleChange = (e) => {
    if (e.target.name === "profilePhoto") {
      setData({ ...data, [e.target.name]: e.target.files[0] });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in data) {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    }

    try {
      const url = "http://localhost:3000/api/user";
      const response = await axios.post(url, formData);
      setMsg(response.data.message);
    } catch (err) {
      // Provide feedback to the user and log the error for debugging
      if (err.response) {
        setError(err.response.data.message || "An unexpected error occurred.");
      } else {
        setError("Unable to connect to the server.");
      }
      console.error("Error during form submission:", err);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
          <div className={styles.left}>
            <h1>Welcome Back</h1>
            <Link to="/login">
              <button type="button" className={styles.white_btn}>
                Sign in
              </button>
            </Link>
          </div>
          <div className={styles.right}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Create Account</h1>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Shop Name"
                name="shopName"
                onChange={handleChange}
                value={data.shopName}
                required
                className={styles.input}
              />
              
              <select
                name="location"
                onChange={handleChange}
                value={data.location}
                required
                className={styles.input}
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              <input
                type="file"
                name="profilePhoto"
                onChange={handleChange}
                className={styles.input}
            />
              {error && <div className={styles.error_msg}>{error}</div>}
              {msg && <div className={styles.success_msg}>{msg}</div>}
              <button type="submit" className={styles.green_btn}>
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;