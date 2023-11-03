import axios from "axios";
import React, { useEffect, useState } from "react";

import styles from "./styles.module.css"; // Import your custom CSS file
import BASE_URL from "../services/helper";
const OfferForm = () => {
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/erp/all/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const [formData, setFormData] = useState({
   
    selectedCategory: "", // New field for product category
    offerDescription: "",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const offerData = {
      selectedCategory: formData.selectedCategory, // Category ID
      offerDescription: formData.offerDescription,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    // Send a POST request to your backend API to create the offer
    axios
      .post(`${BASE_URL}/erp/offers/hello`, offerData)
      .then((response) => {
        // Handle the response or perform any necessary actions
        // Handle the response or perform any necessary actions
        console.log("Offer created successfully", response.data);

        // Set the success message
        setSuccessMessage("Offer added successfully");

        // Clear the form
        setFormData({
          selectedCategory: "",
          offerDescription: "",
          startDate: "",
          endDate: "",
        });
      })
      .catch((error) => {
        console.error("Error creating the offer:", error);
      });
  };

  return (
    <div className={styles.discount_form_container}>
      {" "}
      {/* Apply a custom CSS class for a fixed form */}
      <h2 className={styles.discount_form_title}>Add Offer</h2>
      <form onSubmit={handleSubmit}>
        <select
          type="text"
          name="selectedCategory"
          value={formData.selectedCategory}
          onChange={handleInputChange}
          required
          className={styles.discount_form_input}
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <textarea
          name="offerDescription"
          value={formData.offerDescription}
          onChange={handleInputChange}
          placeholder="Offer Description"
          className={styles.discount_form_input}
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          placeholder="Start Date"
          className={styles.discount_form_input}
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          placeholder="End Date"
          className={styles.discount_form_input}
        />
        <button type="submit" className={styles.discount_form_submit_button}>
          Add Offer
        </button>
      </form>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
    </div>
  );
};

export default OfferForm;
