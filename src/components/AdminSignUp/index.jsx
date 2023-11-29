import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../services/helper";
import styles from "./styles.module.css"; // Import the CSS module

function AdminSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/admin/signup`, formData);
      if (response.status === 201) {
        setSuccess(true);
        // Navigate to "admin/login" route on success
        navigate("/admin/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(true);
      } else {
        console.error("Error signing up:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Bikreta Admin Signup</h2>
      <p className={styles.subtitle}>Register for admin access</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Admin Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Admin Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Register as Admin</button>
      </form>

      {success && (
        <div className={styles.successModal}>Registration successful</div>
      )}
      {error && (
        <div className={styles.errorModal}>Error during registration</div>
      )}
    </div>
  );
}

export default AdminSignup;
