import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../services/helper";
import "./OrderTracker.css";

const OrderTracker = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState("");
  const [productDetails, setProductDetails] = useState(null);

  const stages = [
    { status: "Placed", label: "Order Placed" },
    { status: "Running", label: "Order Running" },
    { status: "Mes", label: "Order Mes" },
    { status: "Delivery", label: "Order Delivery" },
  ];

  const currentStageIndex = stages.findIndex(
    (stage) => stage.status === orderStatus
  );

  const handleTrackOrder = (newStatus) => {
    setOrderStatus(newStatus);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/track/products/${productId}`
        );
        if (response.data && response.data.success) {
          setProductDetails(response.data.product);
        } else {
          console.error(
            "Error fetching product details:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const onClose = () => {
    navigate("/admin");
  };

  return (
    <div className="order-tracker">
      <h2 className="order-title">Order Tracker</h2>
      <div className="stages">
        {stages.map((stage, index) => (
          <div
            key={stage.status}
            className={`order-stage ${
              index === currentStageIndex ? "active" : "completed"
            }`}
          >
            <div
              className="stage-dot"
              onClick={() => handleTrackOrder(stage.status)}
            />
            <div className="stage-label">{stage.label}</div>
          </div>
        ))}
      </div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>

      {productDetails && (
        <div>
          <h3>Product Details:</h3>
          <p>Product Name: {productDetails.productName}</p>
          <p>Price: {productDetails.unitPrice}</p>
          {/* Add more product details as needed */}
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
