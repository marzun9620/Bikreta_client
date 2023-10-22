import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import styles from "./styles.module.css";
import {BASE_URL} from "../services/helper";
function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCategoryExistsPopup, setShowCategoryExistsPopup] = useState(false);
  const [categoryDescription, setCategoryDescription] = useState("");
  //-----------------------------------------------------------------------------------------------------
  //state var for adding products
  // State variables to manage product details

  const [totalCost, setTotalCost] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalMakingCost, setTotalMakingCost] = useState(0);
  const [runningOrders, setRunningOrders] = useState(0);
  const [customersAdded, setCustomersAdded] = useState(0);
  useEffect(() => {
    async function fetchData() {
      try {
        let response;

        // Fetching Total Cost
        response = await axios.get(`${BASE_URL}/erp/total-cost`);
        setTotalCost(response.data.totalCost);
        let xx=response.data.totalCost;
        // Fetching Total Making Cost
        response = await axios.get(`${BASE_URL}/erp/total-making-cost`);
        setTotalMakingCost(response.data.totalMakingCost);
        let yy =response.data.totalMakingCost;
        console.log(xx,yy);
        setTotalProfit(xx-yy)
        // Calculating Total Profit

        // Fetching Running Orders Count
        response = await axios.get(`${BASE_URL}/erp/running-orders-count`);
        setRunningOrders(response.data.runningOrders);

        // Fetching Customers Added
        response = await axios.get(`${BASE_URL}/erp/customers-added-count`);
        setCustomersAdded(response.data.customersAdded);
       
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }

    fetchData();
  }, []);

  const [productData, setProductData] = useState({
    productName: "",
    description: "",
    unitPrice: 0,
    unitMakeCost: 0,
    cartonSize: 0,
    cartonStock: 0,
    minStockThreshold: 0,
    category: "",
    productPhoto: null,
  });
  const [locationChartData, setLocationChartData] = useState({});
  const [timeChartData, setTimeChartData] = useState({});

  useEffect(() => {
    async function fetchLocationData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/bar/product-sales-by-district"
        );
        const data = response.data;

        setLocationChartData({
          labels: data.map((d) => d._id),
          datasets: [
            {
              label: "Sales by Location",
              data: data.map((d) => d.totalSales),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sales by location data:", error);
      }
    }

    async function fetchTimeData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/bar/api/sales-by-district-weekly"
        );
        const data = response.data;
        // console.log(data);

        setTimeChartData({
          labels: data.map((d) => new Date(d.date).toLocaleDateString()),
          datasets: [
            {
              label: "Sales over Time",
              data: data.map((d) => d.totalSales),
              fill: false,
              borderColor: "rgba(75, 192, 192, 0.6)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sales over time data:", error);
      }
    }

    fetchLocationData();
    fetchTimeData();
  }, []);
  //-------------------------------------------------------------------------------------------------------------
  //fetch catagories
  const [categories, setCategories] = useState([]);

  const openModal = (modalName) => {
    setActiveModal(modalName);
    setSidebarOpen(false); // Close the sidebar whenever a modal is opened
  };

  const closeModal = () => {
    setActiveModal(null);
  };
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/erp/all/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    const endpoint = `${BASE_URL}/erp/add/catagory`;

    const categoryData = {
      name: categoryName,
      description: categoryDescription,
    };
    try {
      const response = await axios.post(endpoint, categoryData);

      // Handle 200 and 201 status codes
      console.log("Category added successfully:", response.data);
      setCategoryName("");
      setCategoryDescription("");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      closeModal();
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        setCategoryName("");
        setCategoryDescription("");
        setShowCategoryExistsPopup(true);
        console.log(1);
        setTimeout(() => setShowCategoryExistsPopup(false), 3000);
        closeModal();
      } else {
        console.error(
          "Error adding category:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleChangeOfProduct = (e) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setProductData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    for (let key in productData) {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    }

    const endpoint = `${BASE_URL}/erp/add1/products`; // If you have a BASE_URL variable elsewhere
    try {
      await axios.post(endpoint, formData); // Using the endpoint variable
      alert("Product added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error:", error.response.data); // Log the error for more detailed info
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <div>
      {showSuccessPopup && (
        <div className={styles.successPopup}>Category added successfully!</div>
      )}

      {showCategoryExistsPopup && (
        <div className={styles.errorModal}>
          <p>Category already exists!</p>
        </div>
      )}

      <nav className={styles.navbar}>
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={styles.menuBtn}
        >
          ☰
        </button>

        <span className={styles.navbarBrand}>Bikreta Admin</span>

        <div className={styles.quickLinks}>
          <a href="/orderStatus">Orders</a>
          <a href="#analytics">Analytics</a>
          <a href="#feedback">Feedback</a>
        </div>

        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search..."
          />
          <button className={styles.searchBtn}>🔍</button>
        </div>

        <div className={styles.navItems}>
          {/*
          <div className={styles.messageDropdown}>
            <button className={styles.messageBtn}>📩</button>
            <div className={styles.messageMenu}>
              <a href="#message1">Message 1</a>
              <a href="#message2">Message 2</a>
              <a href="#message3">Message 3</a>
            </div>
          </div>
  */}

          <div className={styles.userDropdown}>
            <span className={styles.userName}>Bikreta Erp </span>
            <div className={styles.userMenu}>
              <a href="#profile">Profile</a>
              <a href="#settings">Settings</a>
              <a href="#logout">Logout</a>
            </div>
          </div>

          <button className={styles.notificationBtn}>🔔</button>
        </div>

        <a href="#support" className={styles.supportLink}>
          Support
        </a>
      </nav>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div
          className={
            isSidebarOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar
          }
        >
          <h2>Most Trusted ERP Solution</h2>
          <button onClick={() => openModal("dashboard")}>Add a catagory</button>
          <button onClick={() => openModal("addProduct")}>Add Products</button>
          <button onClick={() => openModal("dashboard")}>Dashboard</button>
          <button onClick={() => openModal("dashboard")}>Dashboard</button>
        </div>
      </div>

      <div className={styles.metricsContainer}>
        <div className={styles.metricBox}>
          <span className={styles.metricValue}>{totalCost}</span>
          <span className={styles.metricLabel}>Total Cost</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricValue}>{totalProfit}</span>
          <span className={styles.metricLabel}>Total Profit</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricValue}>{totalMakingCost}</span>
          <span className={styles.metricLabel}>Total Making Cost</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricValue}>{runningOrders}</span>
          <span className={styles.metricLabel}>Running Orders</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricValue}>{customersAdded}</span>
          <span className={styles.metricLabel}>Customers Added</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.graphsContainer}>
          {/* Sales by Location Graph */}
          <div className={styles.individualGraphBox}>
            <div className={styles.chartTitle}>Sales by Location</div>
            <div className={styles.chartContainer}>
              {locationChartData.labels && (
                <Bar
                  data={locationChartData}
                  options={{
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                            min: 0,
                          },
                        },
                      ],
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Sales over Time Graph */}
          <div className={styles.individualGraphBox}>
            <div className={styles.chartTitle}>Sales over Time</div>
            <div className={styles.chartContainer}>
              {timeChartData.labels && (
                <Line
                  data={timeChartData}
                  options={{
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                            min: 0,
                          },
                        },
                      ],
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {activeModal === "dashboard" && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <h2>Add Category</h2>
            <form>
              <div className={styles.formGroup}>
                <label>Name:</label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                ></textarea>
              </div>
              <button type="button" onClick={handleAddCategory}>
                Add
              </button>
            </form>
          </div>
        </div>
      )}

      {activeModal === "addProduct" && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <h2>Add Product</h2>
            <form>
              <div className={styles.formGroup}>
                <label>Product Name:</label>
                <input
                  type="text"
                  placeholder="Product Name"
                  name="productName"
                  onChange={handleChangeOfProduct}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  name="description"
                  placeholder="Product Description"
                  required
                  onChange={handleChangeOfProduct}
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Unit Price:</label>
                <input
                  type="number"
                  placeholder="Unit Price"
                  name="unitPrice"
                  onChange={handleChangeOfProduct}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Unit Making Price:</label>
                <input
                  type="number"
                  placeholder="Write making Price"
                  name="unitMakeCost"
                  onChange={handleChangeOfProduct}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Carton Size:</label>
                <input
                  type="number"
                  placeholder="Carton Size"
                  name="cartonSize"
                  onChange={handleChangeOfProduct}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Carton Stock:</label>
                <input
                  type="number"
                  placeholder="Carton Stock"
                  name="cartonStock"
                  onChange={handleChangeOfProduct}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Minimum Stock Threshold:</label>
                <input
                  type="number"
                  placeholder="Min Stock Threshold"
                  name="minStockThreshold"
                  onChange={handleChangeOfProduct}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category:</label>
                <select
                  type="text"
                  name="category"
                  placeholder="Select Category"
                  onChange={handleChangeOfProduct}
                  required
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <input
                  type="file"
                  placeholder="Product Photo"
                  name="productPhoto"
                  onChange={handleChangeOfProduct}
                  required
                />
              </div>

              <button type="button" onClick={handleAddProduct}>
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
