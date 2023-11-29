import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../services/helper";
import styles from "./styles.module.css"; // Import your custom CSS file
const DiscountForm = () => {
  const [formData, setFormData] = useState({
    selectedCategory: "", // New field for selected category
    discountPercentage: 0,
    startDate: "",
    endDate: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const headers = token ? { "x-auth-token": token } : {};
        const response = await axios.get(`${BASE_URL}/erp/all/categories`, {
          headers,
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/erp/offers/discounts/hello`,
        formData
      ); // Make an API request to create a discount
      const createdDiscount = response.data;

      // Handle success (e.g., show a success message)
      console.log("Discount created:", createdDiscount);
      setSuccessMessage("Discount added successfully");
      // Clear the form
      setFormData({
        selectedCategory: "", // Clear the selected category field
        discountPercentage: 0,
        startDate: "",
        endDate: "",
      });

      // You can set a success message state here
      // setSuccessMessage("Discount created successfully");
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Error creating the discount:", error);

      // You can set an error message state here
      // setErrorMessage("Failed to create discount. Please try again.");
    }
  };

  return (
    <div className={styles.discount_form_container}>
      {" "}
      {/* Apply a custom CSS class for a fixed form */}
      <h2 className={styles.discount_form_title}>Add Discount</h2>
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

        <input
          type="number"
          name="discountPercentage"
          value={formData.discountPercentage}
          onChange={handleInputChange}
          placeholder="Discount Percentage"
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
        <button type="submit" className="styles.discount-form-submit-button">
          Add Discount
        </button>
      </form>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
    </div>
  );
};

export default DiscountForm;
