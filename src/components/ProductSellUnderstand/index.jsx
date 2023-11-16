import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import BASE_URL from "../services/helper";
import "./styles.css";
import Header from '../AdminHeader/index';

import styles from "./styles.module.css";

function DataFilterVisualization() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [timeLimit, setTimeLimit] = useState({ from: "", to: "" });
  const [selectedProduct, setSelectedProduct] = useState(null); // Track the selected product
  const [productSalesData, setProductSalesData] = useState({});
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSearchResults = async (query) => {
    if (query.length >= 1) {
      let productEndpoint = `${BASE_URL}/erp/products/search?q=${query}`;

      if (selectedCategory) {
        productEndpoint += `&category=${selectedCategory}`;
      }

      try {
        const [productResponse] = await Promise.all([
          axios.get(productEndpoint),
        ]);

        const combinedResults = [...productResponse.data];
        setData(combinedResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setData([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    fetchSearchResults(query);
  };
  useEffect(() => {
    axios
      .get(`${BASE_URL}admin/1marzun1/api/products`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedCategory, timeLimit]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}admin/3marzun3/api/product-sales-over-time`)
      .then((response) => {
        setProductSalesData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product sales over time:", error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { "x-auth-token": token } : {};

    axios
      .get(`${BASE_URL}/erp/all/categories`, { headers })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
      });
  }, []);

  useEffect(() => {
    const suggestions = generateProductSuggestions(productSalesData);
    setProductSuggestions(suggestions);
  }, [productSalesData]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/category/${selectedCategory}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [selectedCategory]);

  const handleTimeLimitChange = ({ from, to }) => {
    setTimeLimit({ from, to });
  };

  const handleProductSelect = (productId) => {
    const selected = data.find((product) => product.id === productId);

    if (selected) {
      setSelectedProduct(selected);

      setSearchText(""); // Clear the search text
      setData([]); // Clear the search results dropdown
    }
  };
  const handleApplyFilters = () => {
    axios
      .get(
        `${BASE_URL}/4marzun4/api/sales-data?productId=${selectedProduct._id}&from=${timeLimit.from}&to=${timeLimit.to}`
      )
      .then((response) => {
        setProductSalesData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
      });
  };
  

  const generateProductSuggestions = (salesData) => {
    return ["No specific suggestions at the moment."];
  };

  return (
    <div className="data-filter-visualization">
      <Header/>
      <div className="data-filters">
        <label>Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategorySelect(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <label>Time Range:</label>
        <input
          type="date"
          value={timeLimit.from}
          onChange={(e) =>
            handleTimeLimitChange({ from: e.target.value, to: timeLimit.to })
          }
        />
        <input
          type="date"
          value={timeLimit.to}
          onChange={(e) =>
            handleTimeLimitChange({
              from: timeLimit.from,
              to: e.target.value,
            })
          }
        />
        <button onClick={handleApplyFilters}>Apply</button>
      </div>

      <div className="searchContainer">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search for products or categories..."
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </div>

        <div className="searchResults">
          {data.map((item, index) => (
            <li
              key={index}
              onClick={() => handleProductSelect(item.id)}
              style={{ cursor: "pointer" }}
            >
              {item._id ? (
                <>
                  <img
                    src={`${BASE_URL}/api/products/image/${item._id}`}
                    alt={item.name}
                    className={styles.searchResultImage}
                  />
                  <span>{item.productName}</span>
                  <span>৳{item.unitPrice}</span>
                </>
              ) : (
                <>
                  {item.categoryName}{" "}
                  <span className={styles.categoryLabel}>Category</span>
                </>
              )}
            </li>
          ))}
        </div>
      </div>

      <div className="product-selector">
        {selectedProduct ? (
          <div className="selected-product">
            <span>{selectedProduct.productName}</span>
            <button onClick={() => setSelectedProduct(null)}>Clear</button>
          </div>
        ) : null}
      </div>

      {productSalesData && productSalesData.labels && (
        <div className="sales-chart">
          <Line
            data={{
              labels: productSalesData.labels,
              datasets: [
                {
                  label: "Sales Over Time",
                  data: productSalesData.sales,
                  fill: false,
                  borderColor: "rgba(75, 192, 192, 1)",
                },
              ],
            }}
          />
        </div>
      )}

      {showSuggestions && (
        <div className="product-suggestions">
          <h3>Suggestions:</h3>
          <ul>
            {productSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      {productSalesData && productSalesData.length > 0 && (
  <div className="sales-chart">
    <Line
      data={{
        labels: productSalesData.map((sale) => sale.orderPlacedDate), // Assuming 'orderPlacedDate' is the date field
        datasets: [
          {
            label: 'Sales Over Time',
            data: productSalesData.map((sale) => sale.quantity), // Use the relevant field for quantity sold
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      }}
      options={{
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day', // Adjust to your preference (e.g., 'month', 'year')
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      }}
    />
  </div>
)}

    </div>
  );
}

export default DataFilterVisualization;
