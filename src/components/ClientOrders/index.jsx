import axios from "axios"; // If you use axios for data fetching
import React, { useEffect, useState } from "react";
import Footer from "../Footer"; // Adjust path as necessary
import Header from "../Header"; // Adjust path as necessary

function UserPurchases() {
  const [purchases, setPurchases] = useState([]);
  const id = localStorage.getItem("userId");
  console.log(id);
  useEffect(() => {
    // Replace with your API endpoint to get the purchases for the user
    axios
      .get(`http://localhost:3000/api/user/orders/${id}`)
      .then((response) => {
        setPurchases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
      });
  }, []);

  return (
    <div>
      <Header />

      <h1>Your Purchases</h1>

      <ul>
        {purchases.map((purchase) => (
          <li key={purchase._id}>
            <strong>Product:</strong> {purchase.productId.name} <br />
            <strong>Price:</strong> {purchase.productId.price} <br />
            <strong>Order Date:</strong>{" "}
            {new Date(purchase.orderPlacedDate).toLocaleDateString()} <br />
            {purchase.discountId && (
              <>
                <strong>Discount Applied:</strong> {purchase.discountId.amount}%{" "}
                <br />
              </>
            )}
            <strong>Total Paid:</strong> {purchase.totalPaid}
          </li>
        ))}
      </ul>

      <Footer />
    </div>
  );
}

export default UserPurchases;
