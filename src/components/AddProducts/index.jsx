import axios from "axios";
import React, { useState } from "react";
import Header from "../Header";
import styles from "./styles.module.css";

export const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: null,
    brand: "",
    countInStock: 0,
    rating: 0,
  });
  const productCategories = [
    "Masala",
    "Sauce",
    "Home Appliances",
    "Achar",
    "Dairy_Products",
    "Soft_Drinks",
    "Dry-Foods",
    "Chips",
    "Chal",
    "Dal",
    "Ata_Maida",
    "Chocklets",
    "Shaving_kits",

  ];
  const handleChange = (e) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setProductData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const submitProduct = async () => {
    const formData = new FormData();
    for (let key in productData) {
      formData.append(key, productData[key]);
    }
    try {
      await axios.post("http://localhost:3000/api/products", formData);
      alert("Product added successfully!");
      window.location.reload();
    } catch (error) {
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.addProduct_container}>
        <h2>Add a New Product to Bikreta</h2>
        <form onSubmit={submitProduct} className={styles.addProduct_form}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Product Name"
              name="name"
              onChange={handleChange}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Brand"
              name="brand"
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <textarea
            placeholder="Product Description"
            name="description"
            onChange={handleChange}
            required
            className={styles.textarea}
          />
          <div className={styles.formGroup}>
            <input
              type="number"
              placeholder="Product Price"
              name="price"
              onChange={handleChange}
              required
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              name="countInStock"
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <select
              name="category"
              onChange={handleChange}
              required
              className={styles.input}
            >
              <option value="">Select Category</option>
              {productCategories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Rating (out of 5)"
              name="rating"
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton}>
            Add to Bikreta
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
