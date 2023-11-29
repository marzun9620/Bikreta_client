import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import Header from "../AdminHeader";
import DiscountForm from "../DiscountForm/index";
import OfferForm from "../OfferForm/index";
import CategoryPieChart from "../PieChart/ProductCategoryDistribution";
import BASE_URL from "../services/helper";
import BestProducts from "./BestSoldProducts";
import styles from "./styles.module.css";
Modal.setAppElement("#root");

const AdminPanel = () => {
  const [locationChartData, setLocationChartData] = useState({});
  const [timeChartData, setTimeChartData] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalMakingCost, setTotalMakingCost] = useState(0);
  const [runningOrders, setRunningOrders] = useState(0);
  const [customersAdded, setCustomersAdded] = useState(0);
  const [isDiscountModalOpen, setDiscountModalOpen] = useState(false); // State to control the discount modal
  const [isOfferModalOpen, setOfferModalOpen] = useState(false); // State to control the offer modal
  const [productsNeedingRefill, setProductsNeedingRefill] = useState([]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCategoryExistsPopup, setShowCategoryExistsPopup] = useState(false);
  const [categoryDescription, setCategoryDescription] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  //-----------------------------------------------------------------------------------------------------
  //state var for adding products
  // State variables to manage product details

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

  const navigate = useNavigate();

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
  }, []);

  const handleAddCategory = async () => {
    const endpoint = `${BASE_URL}/erp/add/catagory`;

    const categoryData = {
      name: categoryName,
      description: categoryDescription,
    };
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const headers = token ? { "x-auth-token": token } : {};
      const response = await axios.post(endpoint, categoryData, { headers });

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

  const handleOutsideClick = (e) => {
    closeModal();
  };

  // This function stops event propagation when the modal content is clicked.
  const handleContentClick = (e) => {
    e.stopPropagation();
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
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const headers = token ? { "x-auth-token": token } : {};
      await axios.post(endpoint, formData, { headers }); // Using the endpoint variable
      alert("Product added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error:", error.response.data); // Log the error for more detailed info
      alert("Error adding product. Please try again.");
    }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");

        // Set up an Axios instance with the token in the headers
        const axiosInstance = axios.create({
          headers: {
            "x-auth-token": token,
          },
        });

        // Use the axiosInstance for your authenticated requests
        const locationResponse = await axiosInstance.get(
          `${BASE_URL}/bar/product-sales-by-district`
        );

        const locationData = locationResponse.data;

        setLocationChartData({
          labels: locationData.map((d) => d._id),
          datasets: [
            {
              label: "Sales by Location",
              data: locationData.map((d) => d.totalSales),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });

        // Sales over Time data
        const timeResponse = await axiosInstance.get(
          `${BASE_URL}/bar/api/sales-by-district-weekly`
        );

        const timeData = timeResponse.data;

        setTimeChartData({
          labels: timeData.map((d) => new Date(d.date).toLocaleDateString()),
          datasets: [
            {
              label: "Sales over Time",
              data: timeData.map((d) => d.totalSales),
              fill: false,
              borderColor: "rgba(75, 192, 192, 0.6)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");

        // Set up an Axios instance with the token in the headers
        const axiosInstance = axios.create({
          headers: {
            "x-auth-token": token,
          },
        });

        let response;

        // Fetching Total Cost
        response = await axiosInstance.get(`${BASE_URL}/erp/total-cost`);
        setTotalCost(response.data.totalCost);
        let xx = response.data.totalCost;

        // Fetching Total Making Cost
        response = await axiosInstance.get(`${BASE_URL}/erp/total-making-cost`);
        setTotalMakingCost(response.data.totalMakingCost);
        let yy = response.data.totalMakingCost;
        setTotalProfit(xx - yy);

        // Fetching Running Orders Count
        response = await axiosInstance.get(
          `${BASE_URL}/erp/running-orders-count`
        );
        setRunningOrders(response.data.runningOrders);

        // Fetching Customers Added
        response = await axiosInstance.get(
          `${BASE_URL}/erp/customers-added-count`
        );
        setCustomersAdded(response.data.customersAdded);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }

    fetchData();
  }, []);

  // Function to fetch products needing refill
  const fetchProductsNeedingRefill = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { "x-auth-token": token } : {};
      const response = await axios.get(
        `${BASE_URL}/erp/products-needing-refill`,
        {
          headers,
        }
      );
      setProductsNeedingRefill(response.data);
    } catch (error) {
      console.error("Failed to fetch products needing refill:", error);
    }
  };

  // Function to open modal and fetch products needing refill
  const handleRefillButtonClick = () => {
    fetchProductsNeedingRefill();
    // Open the modal for products needing refill
    setProductsNeedingRefillModalOpen(true);
  };
  const [isProductsNeedingRefillModalOpen, setProductsNeedingRefillModalOpen] =
    useState(false);
  const handleProductClick = (product) => {
    const updatedProducts = productsNeedingRefill.map((p) => ({
      ...p,
      isEditing: p._id === product._id ? !p.isEditing : false,
    }));

    setProductsNeedingRefill(updatedProducts);
  };

  const handleInputChange = (product, field, value) => {
    const updatedProducts = productsNeedingRefill.map((p) => ({
      ...p,
      [field]: p._id === product._id ? value : p[field],
    }));

    setProductsNeedingRefill(updatedProducts);
  };

  const handleUpdateProduct = (product) => {
    // Make an API call to update the product schema
    // Include the necessary data from the product object

    // For example, you can use a service or fetch API to update the product
    updateProductSchema(product)
      .then((response) => {
        // Handle success
        console.log("Product schema updated successfully");
        // Refresh products after update
        fetchProductsNeedingRefill();
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating product schema", error);
      });

    // Close the editing mode
    const updatedProducts = productsNeedingRefill.map((p) => ({
      ...p,
      isEditing: false,
    }));

    setProductsNeedingRefill(updatedProducts);
  };

  const updateProductSchema = (product) => {
    const { _id, curtonStock, curtonSize } = product;
    const apiUrl = `${BASE_URL}/erp/update-product-schema/${_id}`;

    return axios.patch(apiUrl, {
      curtonStock,
      curtonSize,
      // Include other fields as needed
    });
  };
  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>Most Trusted ERP Solution</h2>
        </div>
        <button onClick={() => openModal("dashboard")}>Add a category</button>
        <button onClick={() => openModal("addProduct")}>Add Products</button>
        <button onClick={() => openModal("addAdmin")}>Add an Admin</button>
        <button onClick={() => openModal("user")}>All Users</button>
        <button onClick={() => setDiscountModalOpen(true)}>Add Discount</button>
        <button onClick={() => setOfferModalOpen(true)}>Add Offer</button>
        <button onClick={handleRefillButtonClick}>
          Products Needing Refill
        </button>

        {/* Products Needing Refill Modal */}

        {/* Dropdown Button */}
        <div className={styles.dropdown}>
          <button onClick={() => setDropdownOpen(!isDropdownOpen)}>
            Analysis
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownContent}>
              <Link to="/analysis" className={styles.productLink}>
                <button>Individual Analysis</button>
              </Link>
              <Link to="/analysis_result" className={styles.productLink}>
                <button>Overall Analysis</button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <Header />

        <div className={styles.metricsContainer}>
          <div
            className={styles.metricBox}
            onClick={() => navigate("/orderStatus")}
          >
            <span className={styles.metricValue}>{totalCost}</span>
            <span className={styles.metricLabel}>Total Cost</span>
          </div>

          <div
            className={styles.metricBox}
            onClick={() => navigate("/orderStatus")}
          >
            <span className={styles.metricValue}>{totalProfit}</span>
            <span className={styles.metricLabel}>Total Profit</span>
          </div>
          <div
            className={styles.metricBox}
            onClick={() => navigate("/orderStatus")}
          >
            <span className={styles.metricValue}>{totalMakingCost}</span>
            <span className={styles.metricLabel}>Total Making Cost</span>
          </div>
          <div
            className={styles.metricBox}
            onClick={() => navigate("/status-change")}
          >
            <span className={styles.metricValue}>{runningOrders}</span>
            <span className={styles.metricLabel}>Running Orders</span>
          </div>
          <div
            className={styles.metricBox}
            onClick={() => navigate("/Admin/allUsers")}
          >
            <span className={styles.metricValue}>{customersAdded}</span>
            <span className={styles.metricLabel}>Customers Added</span>
          </div>
        </div>

        {/* Charts */}
        <div className={styles.chartsContainer}>
          {/* Location Sales */}
          <div className={styles.locationSales}>
            <div className={styles.chartBox}>
              <div className={styles.chartTitle}>Sales by Location</div>
              <div className={styles.chartContainer}>
                {/* Bar chart component */}
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
          </div>

          {/* Category Pie Chart */}
          <div className={styles.categoryChart}>
            <CategoryPieChart />
          </div>

          {/* Time Sales */}
          <div className={styles.timeSales}>
            <div className={styles.chartBox}>
              <div className={styles.chartTitle}>Sales over Time</div>
              <div className={styles.chartContainer}>
                {/* Line chart component */}
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
          <div className={styles.bestProducts}>
            <BestProducts />
          </div>
        </div>
      </div>

      {/* Best Products */}

      {/* Modals */}
      <Modal
        isOpen={isDiscountModalOpen}
        onRequestClose={() => setDiscountModalOpen(false)}
        className="modal-content"
      >
        <h2 className="modal-title">Add Discount</h2>
        <DiscountForm />
      </Modal>

      <Modal
        isOpen={isOfferModalOpen}
        onRequestClose={() => setOfferModalOpen(false)}
        className="modal-content"
      >
        <h2 className="modal-title">Add Offer</h2>
        <OfferForm />
      </Modal>

      <Modal
        isOpen={isProductsNeedingRefillModalOpen}
        onRequestClose={() => setProductsNeedingRefillModalOpen(false)}
        className={styles.productsNeedingRefillModal}
        overlayClassName={styles.productsNeedingRefillOverlay}
      >
        <div className={styles.productsNeedingRefillModalContent}>
          <span
            className={styles.productsNeedingRefillClose}
            onClick={() => setProductsNeedingRefillModalOpen(false)}
          >
            &times;
          </span>
          <h2 className={styles.productsNeedingRefillModalTitle}>
            Products Needing Refill
          </h2>
          {productsNeedingRefill.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <ul className={styles.productsNeedingRefillList}>
              {productsNeedingRefill.map((product) => (
                <li key={product._id}>
                  <div className={styles.productItem}>
                    <span>{product.productName}</span>
                    <button onClick={() => handleProductClick(product)}>
                      Edit
                    </button>
                  </div>
                  {product.isEditing && (
                    <div className={styles.editForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor={`curtonStock-${product._id}`}>
                          Carton Stock:
                        </label>
                        <input
                          type="text"
                          id={`curtonStock-${product._id}`}
                          value={product.curtonStock}
                          onChange={(e) =>
                            handleInputChange(
                              product,
                              "curtonStock",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor={`curtonSize-${product._id}`}>
                          Carton Size:
                        </label>
                        <input
                          type="text"
                          id={`curtonSize-${product._id}`}
                          value={product.curtonSize}
                          onChange={(e) =>
                            handleInputChange(
                              product,
                              "curtonSize",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <button onClick={() => handleUpdateProduct(product)}>
                        Update
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>

      {activeModal === "dashboard" && (
        <div className={styles.modal} onClick={handleOutsideClick}>
          <div className={styles.modalContent} onClick={handleContentClick}>
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
      {activeModal === "addAdmin" && navigate("/Admin/Signup")}
      {activeModal === "user" && navigate("/Admin/allUsers")}

      {activeModal === "addProduct" && (
        <div className={styles.modal} onClick={handleOutsideClick}>
          <div className={styles.modalContent} onClick={handleContentClick}>
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
};

export default AdminPanel;
