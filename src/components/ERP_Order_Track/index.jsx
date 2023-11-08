import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../services/helper";
import styles from "./styles.module.css";
const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Placed");
  const [sortType, setSortType] = useState("date");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default value
  const [categories, setCategories] = useState([]);
  const [currentOrderDetails, setCurrentOrderDetails] = useState([]);

  const fetchOrders = () => {
    let url = `${BASE_URL}/api/products/status/${filter}`;

    const params = new URLSearchParams();

    if (selectedCategory !== "All") {
      params.append("category", selectedCategory);
    }

    if (sortType) {
      params.append("sortType", sortType);
    }

    url += `?${params.toString()}`;
    console.log(url);

    axios
      .get(url)
      .then((response) => {
        if (response.data && response.data.success) {
          const rawData = [...response.data.data];
          const groupedOrders = groupOrdersByProduct(rawData);
          setOrders(groupedOrders);

          let sortedOrders = [...groupedOrders];

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
  };

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
    fetchOrders(); // Load data on component mount
  }, []);

  const groupOrdersByProduct = (orders) => {
    const productMap = {};

    orders.forEach((order) => {
      const productId = order.productId._id;
      //console.log(productId);

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
  const downloadCSV = () => {
    // Define the CSV content
    const csvContent = createCSVContent();

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create a download link and trigger the download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "order_status.csv";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const createCSVContent = () => {
    const header = [
      "Product",
      "Status",
      "Order Date",
      "Expected Delivery",
      "Actual Delivery",
      "Total Unit Price",
      "Total Making Price",
      "Profit",
      "Tracking",
    ].join(",");

    const rows = orders.map((product) => {
      const totalQuantity = Object.values(product.users).reduce(
        (acc, userOrder) => acc + userOrder.count,
        0
      );
      function formatDate(date) {
        // Check if the date is valid
        if (date instanceof Date && !isNaN(date)) {
          return date.toLocaleDateString(); // Format date as a string
        }
        return ""; // Return an empty string if the date is not valid
      }

      return [
        `${product.productId.productName} (Count: ${totalQuantity})`,
        product.orderStatus,
        formatDate(new Date(product.orderPlacedDate)),
        formatDate(new Date(product.expectedDeliveryDate)),
        product.actualDeliveryDate
          ? formatDate(new Date(product.actualDeliveryDate))
          : "Not Delivered",
        product.totalUnitPrice,
        product.totalUnitMakingPrice,
        product.profit,
        "Track Order",
      ].join(",");
    });

    return [header, ...rows].join("\n");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bikreta Erp Order Track</h1>
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
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button className={styles.applyButton} onClick={fetchOrders}>
          Apply Filters
        </button>
        <button onClick={downloadCSV} className={styles.downloadButton}>
          Download CSV
        </button>
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
            <th>Show Details</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((product) => {
            const totalQuantity = Object.values(product.users).reduce(
              (acc, userOrder) => acc + userOrder.count,
              0
            );
            const representativeOrder =
              product.users[Object.keys(product.users)[0]];

            return (
              <tr key={product._id}>
                <td>
                  <img
                    src={`${BASE_URL}/api/products/image/${product.productId._id}`}
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
                  <Link
                    to={`/order-tracker/${product.productId._id}`}
                    className={styles.trackLink}
                  >
                    Track Order
                  </Link>
                </td>

                <td>
                  <button
                    onClick={() => handleRowClick(product.productId._id)}
                    className={styles.showDetailsButton}
                  >
                    Show Details
                  </button>
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
        <p>© 2023 Bikreta. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OrderStatus;
