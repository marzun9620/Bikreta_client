import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this if you are using react-router-dom for navigation
import BASE_URL from "../services/helper";
import styles from "./styles.module.css"; // Import the CSS module
function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      const response = await axios.post(`${BASE_URL}/admin/login`, formData);

      if (response.status === 200) {
        const token = response.data.token; // Access the token from the response body
        localStorage.setItem("token", token);
        navigate("/admin");
      } else {
        // Handle errors
        console.error("Error logging in:", response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error logging in:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "An unexpected error occurred."); // Display error message to the user (use a better UX approach in a real application)
    }
  };

  return (
    <div className={styles.container}>
      <h2>Bikreta Admin Login</h2>
      <p className={styles.subtitle}>Admin access only</p>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
}

export default AdminLogin;
