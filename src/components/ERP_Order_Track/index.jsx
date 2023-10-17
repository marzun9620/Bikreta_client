import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Placed");
  const [sortType, setSortType] = useState("date");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default value

  const [currentOrderDetails, setCurrentOrderDetails] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    let url = `${BASE_URL}/api/products/status/${filter}`;

    const params = new URLSearchParams();

    if (selectedCategory !== "All") {
      params.append("category", selectedCategory);
    }

    if (sortType) {
      params.append("sortType", sortType);
    }

    url += `?${params.toString()}`;

    axios
      .get(url)
      .then((response) => {
        if (response.data && response.data.success) {
          const rawData = [...response.data.data];
          console.log(rawData);
          const groupedOrders = groupOrdersByProduct(rawData);
          setOrders(groupedOrders);

          let sortedOrders = [...groupedOrders]; // Use spread operator to ensure we don't mutate original array

          if (sortType === "date") {
            sortedOrders.sort(
              (a, b) =>
                new Date(b.orderPlacedDate) - new Date(a.orderPlacedDate)
            );
          } else if (sortType === "upcomingWeek") {
            const oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
            sortedOrders = sortedOrders.filter(
              (order) => new Date(order.expectedDeliveryDate) <= oneWeekFromNow
            );
          }

          setOrders(sortedOrders);
        } else {
          console.error("Error from server:", response.data.message);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [filter, sortType, selectedCategory]);

  const groupOrdersByProduct = (orders) => {
    const productMap = {};

    orders.forEach((order) => {
      const productId = order.productId._id;

      // Ensure values are numeric or default to 0
      const unitPrice = Number(order.productId.unitPrice) || 0;
      const unitMakingPrice = Number(order.productId.unitMakeCost) || 0;
      const profit = unitPrice - unitMakingPrice;

      if (!productMap[productId]) {
        productMap[productId] = {
          ...order,
          totalUnitPrice: unitPrice,
          totalUnitMakingPrice: unitMakingPrice,
          profit: profit,
          users: {
            [order.userId._id]: {
              ...order.userId,
              count: 1,
            },
          },
        };
      } else {
        productMap[productId].totalUnitPrice += unitPrice;
        productMap[productId].totalUnitMakingPrice += unitMakingPrice;
        productMap[productId].profit += profit;

        if (productMap[productId].users[order.userId._id]) {
          productMap[productId].users[order.userId._id].count += 1;
        } else {
          productMap[productId].users[order.userId._id] = {
            ...order.userId,
            count: 1,
          };
        }
      }
    });

    return Object.values(productMap);
  };

  const handleRowClick = (productId) => {
    const product = orders.find((order) => order.productId._id === productId);
    if (product) {
      setCurrentOrderDetails(Object.values(product.users));
      setShowModal(true);
    }
    // console.log(orders);
  };

  return (
    <div className={styles.container}>
      {/* ... header and filter section remain unchanged ... */}
      <header className={styles.header}>
        <h1>My E-commerce</h1>
      </header>
      <h2>Orders</h2>

      <div className={styles.filterSection}>
        <select
          className={styles.select}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Placed">Upcoming Orders</option>
          <option value="running">Running Orders</option>
          <option value="completed">Completed Orders</option>
        </select>
        <select
          className={styles.select}
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="upcomingWeek">Delivery in Upcoming Week</option>
        </select>
        <select
          className={styles.select}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Butter">Butter</option>
          <option value="Apparel">Apparel</option>
          <option value="Groceries">Groceries</option>
          {/* ... add other categories as needed ... */}
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>

            <th>Status</th>
            <th>Order Date</th>
            <th>Expected Delivery</th>
            <th>Actual Delivery</th>
            <th>Total Unit Price</th>
            <th>Total Making Price</th>
            <th>Profit</th>
            <th>Tracking</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((product) => {
            const totalQuantity = Object.values(product.users).reduce(
              (acc, userOrder) => acc + userOrder.count,
              0
            );
            const representativeOrder =
              product.users[Object.keys(product.users)[0]]; // This is just to get an example order for other attributes.
            // console.log(product);
            return (
              <tr
                key={product._id}
                onClick={() => handleRowClick(product.productId._id)}
              >
                <td>
                  <img
                    src={`http://localhost:3000/api/products/image/${product.productId._id}`}
                    alt={product.productId.productName}
                  />
                  {product.productId.productName} Count: {totalQuantity}
                </td>
                <td>{product.orderStatus}</td>
                <td>
                  {new Date(product.orderPlacedDate).toLocaleDateString()}
                </td>
                <td>
                  {new Date(product.expectedDeliveryDate).toLocaleDateString()}
                </td>
                <td>
                  {product.actualDeliveryDate
                    ? new Date(product.actualDeliveryDate).toLocaleDateString()
                    : "Not Delivered"}
                </td>
                <td>{product.totalUnitPrice}</td>
                <td>{product.totalUnitMakingPrice}</td>
                <td>{product.profit}</td>
                <td>
                  <a href="#" className={styles.trackLink}>
                    Track Order
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Order Details for {currentOrderDetails[0]?.productName}</h2>
            <ul>
              {currentOrderDetails.map((userOrder) => (
                <li key={userOrder._id}>
                  User: {userOrder.fullName}, Quantity: {userOrder.count}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p>© 2023 My E-commerce. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OrderStatus;
