import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./styles.module.css";

function UserPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const id = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/orders/${id}`)
      .then((response) => {
        console.log(response.data.data);
        setPurchases(response.data.data);
        setLoading(false); // Data is loaded
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
        setLoading(false); // Loading has finished
      });
  }, [id]); // Added id as a dependency

  return (
    <div className={styles.container}>
      <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
      />
      <div className={styles.mainContent}>
        <h1>Your Purchases</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.purchases}>
            {Array.isArray(purchases) && purchases.length > 0 ? (
              purchases.map((purchase) => (
                <div key={purchase._id} className={styles.purchaseCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={`http://localhost:3000/api/products/image/${purchase.productId._id}`}
                      alt={purchase.productId.productName}
                    />
                  </div>
                  <div className={styles.purchaseDetails}>
                    <strong>Product:</strong> {purchase.productId.productName}{" "}
                    <br />
                    <strong>Price:</strong> {purchase.productId.unitPrice}{" "}
                    <br />
                    <strong>Order Date:</strong>{" "}
                    {new Date(purchase.orderPlacedDate).toLocaleDateString()}{" "}
                    <br />
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
        )}
      </div>

      <Footer />
    </div>
  );
}

export default UserPurchases;
