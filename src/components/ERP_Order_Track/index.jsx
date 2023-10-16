
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Placed");
  const [sortType, setSortType] = useState("date");
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000"; 

  useEffect(() => {
    axios.get(`${BASE_URL}/api/products/status/${filter}`)
      .then((response) => {
        let sortedOrders = [...response.data];
        console.log([...response.data]);
        if (sortType === "date") {
          sortedOrders.sort((a, b) => new Date(b.orderPlacedDate) - new Date(a.orderPlacedDate));
        } else if (sortType === "upcomingWeek") {
          const oneWeekFromNow = new Date();
          oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
          sortedOrders = sortedOrders.filter(order => new Date(order.expectedDeliveryDate) <= oneWeekFromNow);
        }

        setOrders(sortedOrders);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [filter, sortType]);


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My E-commerce</h1>
      </header>
      
      <h2>Orders</h2>
      
      <div className={styles.filterSection}>
        <select className={styles.select} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="Placed">Upcoming Orders</option>
          <option value="running">Running Orders</option>
          <option value="completed">Completed Orders</option>
        </select>
        <select className={styles.select} value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="upcomingWeek">Delivery in Upcoming Week</option>
        </select>
      </div>
      
      <table className={styles.table}>
    <thead>
        <tr>
            <th>Product</th>
            <th>User</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Expected Delivery</th>
            <th>Actual Delivery</th>
            <th>Tracking</th>
        </tr>
    </thead>
    <tbody>
        {orders.map((order) => (
            <tr key={order._id}>
                <td>
                    <img src={order.productId.imageUrl} alt={order.productId.name} className={styles.productImage} />
                    {order.productId.name}
                </td>
                <td>{order.userId.fullName}</td>
                <td>{order.orderStatus}</td>
                <td>{new Date(order.orderPlacedDate).toLocaleDateString()}</td>
                <td>{new Date(order.expectedDeliveryDate).toLocaleDateString()}</td>
                <td>{order.actualDeliveryDate ? new Date(order.actualDeliveryDate).toLocaleDateString() : "Not Delivered"}</td>
               {/* <td><a href="#" className={styles.trackLink}>Track Order</a></td> */ }
            </tr>
        ))}
    </tbody>
</table>

      <footer className={styles.footer}>
        <p>© 2023 My E-commerce. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OrderStatus;
