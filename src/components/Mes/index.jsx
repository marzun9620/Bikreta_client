import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../AdminHeader/index";
import BASE_URL from "../services/helper";
import "./styles.css";

const PurchaseHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const initialState = {
    purchaseHistory: [],
    totalHistory: 0,
    selectedCategory: "",
    categories: [],
    stateHistory: [], // Keep track of previous states
    isFetchingRunningOrders: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.payload };
      case "TOGGLE_FETCH_RUNNING_ORDERS":
        return {
          ...state,
          isFetchingRunningOrders: !state.isFetchingRunningOrders,
        };
      case "GO_BACK":
        const prevState = state.stateHistory.pop() || initialState;
        return { ...state, ...prevState };
      default:
        return state;
    }
  };
  const addSumQuantityColumn = (history) => {
    const quantitySumMap = {};
    return history.reduce((accumulator, purchase) => {
      const productId = purchase.productId;
      if (!quantitySumMap[productId]) {
        quantitySumMap[productId] = 0;
      }
      quantitySumMap[productId] += purchase.quantity;

      // Check if the purchase entry already exists in accumulator
      const existingPurchase = accumulator.find(
        (entry) => entry.productId === productId
      );

      if (existingPurchase) {
        // If exists, update the quantity
        existingPurchase.quantity = quantitySumMap[productId];
      } else {
        // If not exists, add the purchase entry to accumulator
        accumulator.push({ ...purchase, quantity: quantitySumMap[productId] });
      }

      return accumulator;
    }, []);
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { "x-auth-token": token } : {};
        const response = await axios.get(`${BASE_URL}/erp/all/categories`, {
          headers,
        });
        dispatch({ type: "SET_STATE", payload: { categories: response.data } });
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [state.selectedCategory, state.isFetchingRunningOrders]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let apiUrl = `${BASE_URL}/erp/22api/placed/Delivered?category=${state.selectedCategory}`;

      if (state.isFetchingRunningOrders) {
        apiUrl = `${BASE_URL}/erp/22api1/placed/Delivered?category=${state.selectedCategory}&orderStatus=Mes`;
      }

      const response = await axios.get(apiUrl);
      const updatedData = addSumQuantityColumn(response.data);
      console.log(updatedData);
      dispatch({
        type: "SET_STATE",
        payload: { purchaseHistory: updatedData },
      });
      calculateTotalHistory(updatedData);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    } finally {
      setLoading(false);
    }
  };
  const calculateTotalHistory = (history) => {
    const total = history.reduce(
      (sum, purchase) => sum + purchase.totalPaid,
      0
    );
    dispatch({ type: "SET_STATE", payload: { totalHistory: total } });
  };

  const handleToggleFetchRunningOrders = () => {
    if (isFetchingRunningOrders) {
      // If "Generate Bill" is clicked, navigate to the BillGenerationPage
      navigate("/bill-generation"); // Replace "/bill-generation" with the actual path
    } else {
      dispatch({ type: "TOGGLE_FETCH_RUNNING_ORDERS" });
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const apiUrl = state.selectedCategory
        ? `${BASE_URL}/erp/api/update-status?category=${state.selectedCategory}`
        : `${BASE_URL}/erp/api/update-status/Delivered`;

      await axios.put(apiUrl);
      alert("Successfully updated");
      fetchData();
    } catch (error) {
      alert("Error updating order status");
      console.error("Error updating order status:", error);
    }
  };

  const handleGoBack = () => {
    dispatch({ type: "GO_BACK" });
  };

  const handleCategoryChange = (e) => {
    dispatch({
      type: "SET_STATE",
      payload: { selectedCategory: e.target.value },
    });
  };

  const {
    categories,
    selectedCategory,
    totalHistory,
    purchaseHistory,
    isFetchingRunningOrders,
  } = state;

  return (
    <div className="page-container">
      <Header />
      <div>
        <h2>Ready to Delivery</h2>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <p className="total-spent">Total Amount Collected: ৳{totalHistory}</p>

        {/* Show spinner while loading */}

        <div className="button-container">
          <button onClick={handleGoBack} className="back-button">
            Back
          </button>

          <button
            onClick={handleToggleFetchRunningOrders}
            className="fetch-running-orders-button"
          >
           Generate a Bill
          </button>
          <button onClick={handleUpdateStatus} className="update-button">
            Update Status to 'Delivered'
          </button>
        </div>
        <table className="purchase-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Total Paid</th>
              <th>Product Image</th>
            </tr>
          </thead>
          {loading && (
            <div className="loadingIndicator">
              <div className="loadingSpinner"></div>
            </div>
          )}
          <tbody>
            {purchaseHistory.map((purchase) => (
              <tr key={purchase._id}>
                <td>{purchase.productId}</td>
                <td>{purchase.quantity}</td>
                <td>৳{purchase.totalPaid}</td>
                <td>
                  <img
                    src={`${BASE_URL}/api/products/image/${purchase.productId}`}
                    alt={`Product ${purchase.productId}`}
                    className="product-image"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
