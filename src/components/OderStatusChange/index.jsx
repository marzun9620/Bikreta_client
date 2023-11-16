// PurchaseHistoryPage.js

import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../services/helper";
import "./styles.css"; // Import the CSS file
import Header from '../AdminHeader/index'

const PurchaseHistoryPage = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [totalHistory, setTotalHistory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
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

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/erp/api/placed?category=${selectedCategory}`
      );
      setPurchaseHistory(response.data);
      calculateTotalHistory(response.data);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  const calculateTotalHistory = (history) => {
    const total = history.reduce(
      (sum, purchase) => sum + purchase.totalPaid,
      0
    );
    setTotalHistory(total);
  };

  const handleUpdateStatus = async () => {
    try {
      const apiUrl = selectedCategory
        ? `${BASE_URL}/erp/api/update-status?category=${selectedCategory}`
        : `${BASE_URL}/erp/api/update-status`;

      await axios.put(apiUrl);
      alert('Successfull');
      fetchData();
    } catch (error) {
        alert("Error");
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="page-container">
    <Header/>
      <div>
        <h2>Purchase History</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <p className="total-spent">Total Amount Spent: ${totalHistory}</p>
        <button onClick={handleUpdateStatus} className="update-button">
          Update Status to 'Running'
        </button>
        <table className="purchase-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Total Paid</th>
              <th>Product Image</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.map((purchase) => (
              <tr key={purchase._id}>
                <td>{purchase.productId}</td>
                <td>{purchase.quantity}</td>
                <td>${purchase.totalPaid}</td>
                <td>
                  <img
                    src={`${BASE_URL}/api/products/image/${purchase.productId}`} // Replace with your actual field
                    alt={`Product ${purchase.productId}`}
                    className="product-image"
                  />
                </td>
                {/* Add more table cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
