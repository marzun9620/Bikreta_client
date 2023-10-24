import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';  // Import the CSS module

function AdminSignup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
      });
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      }
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3000/admin/signup', formData);
          console.log(response.data);
        } catch (error) {
          console.error("Error signing up:", error);
        }
      }
    

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
    </div>
  )
}

export default AdminSignup;
