import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../services/helper";
import styles from "./styles.module.css";

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
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchLocationData() {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const headers = token ? { "x-auth-token": token } : {};
        const response = await axios.get(
          `${BASE_URL}/bar/product-sales-by-district`,
          { headers }
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
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const headers = token ? { "x-auth-token": token } : {};
        const response = await axios.get(
          `${BASE_URL}/bar/api/sales-by-district-weekly`,
          { headers }
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
  });

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
          <div className={styles.userDropdown}>
            
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

      

  
    </div>
  );
}

export default Header;
