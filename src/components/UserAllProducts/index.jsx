import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../services/helper";
import "./UserPurchaseHistory.css"; // Import your CSS file

const UserPurchaseHistory = () => {
  // ... (rest of the code remains the same)
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("");
  const [filteredPriceRange, setFilteredPriceRange] = useState("");
  const [userCart, setUserCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const userId = id;

  useEffect(() => {
    // Fetch the user's purchase history
    axios
      .get(`${BASE_URL}/admin/api/user/${userId}/purchase-history`)
      .then((response) => {
        setPurchaseHistory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user purchase history:", error);
      });

    axios
      .get(`${BASE_URL}/admin/2api/user/${userId}/cart`)
      .then((response) => {
        console.log(response.data);
        setUserCart(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user cart:", error);
      });

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
  }, [userId]);

  const filterByCategory = async () => {
    try {
      // Make an API request to filter purchase history by category
      const response = await axios.get(
        `${BASE_URL}/admin/api/user/${userId}/purchase-history?category=${filteredCategory}`
      );
      setPurchaseHistory(response.data);
    } catch (error) {
      console.error("Error filtering by category:", error);
    }
  };

  const filterByPriceRange = async () => {
    try {
      // Make an API request to filter purchase history by price range
      const response = await axios.get(
        `${BASE_URL}/admin/api/user/${userId}/purchase-history?priceRange=${filteredPriceRange}`
      );
      setPurchaseHistory(response.data);
    } catch (error) {
      console.error("Error filtering by price range:", error);
    }
  };

  // Group products by category
  const groupedPurchaseHistory = purchaseHistory.reduce((acc, purchase) => {
    const existingProduct = acc.find(
      (group) => group.productId === purchase.productId
    );
    if (existingProduct) {
      existingProduct.quantity += purchase.quantity;
      existingProduct.totalPaid += purchase.totalPaid;
    } else {
      acc.push({
        productId: purchase.productId,
        productName: purchase.productName,
        category: purchase.category,
        quantity: purchase.quantity,
        totalPaid: purchase.totalPaid,
      });
    }
    return acc;
  }, []);

  return (
    <div className="user-purchase-history-container">
      <h1 className="purchase-history-heading">Purchase History</h1>

      <div className="filter-section">
        <select onChange={filterByCategory} className="category-select">
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Price Range"
          onChange={filterByPriceRange}
          className="price-range-input"
        />
      </div>

      <div className="purchase-history-list">
        {groupedPurchaseHistory.map((purchase, index) => (
          <div key={index} className="product-card">
            <div className="product-info">
              <p>
                <strong>Product Name:</strong> {purchase.productId.productName}
              </p>
              <p>
                <strong>Category:</strong> {purchase.productId.category}
              </p>
              <p>
                <strong>Quantity:</strong> {purchase.quantity}
              </p>
              <p>
                <strong>Total Paid:</strong> ${purchase.totalPaid}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="shopping-cart-section">
        <h1 className="shopping-cart-heading">Shopping Cart</h1>
        <ul className="shopping-cart-list">
          {userCart && userCart.length > 0 ? (
            userCart.map((cartItem, index) => (
              <li key={index} className="cart-item">
                <div className="cart-item-info">
                  <p>
                    <strong>Product Name:</strong> {cartItem.productName}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {cartItem.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ${cartItem.price}
                  </p>
                  {/* Add more cart item details as needed */}
                </div>
              </li>
            ))
          ) : (
            <li className="cart-item empty-cart">No items in the cart</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserPurchaseHistory;
