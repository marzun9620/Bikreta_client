import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../services/helper";
import styles from "./styles.module.css";
import Footer from "../Footer";
import Header from "../Header";
function UserPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const id = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    axios
      .get(`${BASE_URL}/api/user/orders/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      })
      .then((response) => {
        setPurchases(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
        setLoading(false);
      });
  }, [id]);

  const applyFilter = () => {
    if (selectedFilter === "All") {
      setFilteredPurchases(purchases);
    } else {
      const filtered = purchases.filter(
        (purchase) => purchase.orderStatus === selectedFilter
      );
      setFilteredPurchases(filtered);
    }
  };

  return (
    <div className={styles.container}>
    <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
      />
      <div className={styles.filter}>
        <label>Filter by Order Status:</label>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Placed">Placed</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button onClick={applyFilter}>Apply</button>
      </div>
      <div className={styles.purchases}>
        {loading ? (
          <p>Loading...</p>
        ) : filteredPurchases.length > 0 ? (
          filteredPurchases.map((purchase) => (
            <div key={purchase._id} className={styles.purchaseCard}>
              <div className={styles.imageContainer}>
                <img
                  src={`${BASE_URL}/api/products/image/${purchase.productId._id}`}
                  alt={purchase.productId.productName}
                />
              </div>
              <div className={styles.purchaseDetails}>
                <strong>Product:</strong> {purchase.productId.productName}{" "}
                <br />
                <strong>Price:</strong> {purchase.productId.unitPrice} <br />
                <strong>Order Date:</strong>{" "}
                {new Date(purchase.orderPlacedDate).toLocaleDateString()} <br />
                {purchase.discountId && (
                  <>
                    <strong>Discount Applied:</strong>{" "}
                    {purchase.discountId.amount}% <br />
                  </>
                )}
                <strong>Total Paid:</strong> {purchase.totalPaid}
              </div>
            </div>
          ))
        ) : (
          <p>No purchases found.</p>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default UserPurchases;
