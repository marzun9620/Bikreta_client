// BillGenerationComponent.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Header from "../AdminHeader/index";
import BASE_URL from "../services/helper";
import "./styles.css";

const BillGenerationComponent = () => {
  const [data, setData] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/erp/erp/api/running`);
      setData(response.data);
      calculateTotalCost(response.data);
      analyzeData(response.data);
    } catch (error) {
      console.error("Error fetching running orders:", error);
    }
  };

  const calculateTotalCost = (runningOrders) => {
    const total = runningOrders.reduce(
      (sum, order) => sum + order.totalMakeCost,
      0
    );
    setTotalCost(total);
  };

  const fetchProductName = async (productId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/erp/erp/api/product/${productId}`
      );
      return response.data.productName;
    } catch (error) {
      console.error("Error fetching product name:", error);
      return null;
    }
  };

  const analyzeData = async (runningOrders) => {
    const total = runningOrders.length;

    const ordersWithProductName = await Promise.all(
      runningOrders.map(async (order) => {
        const orderProductName = await fetchProductName(order.productId);
        return { ...order, productName: orderProductName };
      })
    );

    const highestCostProduct = ordersWithProductName.reduce(
      (max, order) => (order.totalMakeCost > max.totalMakeCost ? order : max),
      ordersWithProductName[0]
    );

    const uniqueProductCount = new Set(
      runningOrders.map((order) => order.productId)
    ).size;

    const totalRevenue = runningOrders.reduce(
      (sum, order) => sum + (order.totalMakeCost - order.totalPaid),
      0
    );

    const totalCost = runningOrders.reduce(
      (sum, order) => sum + order.totalMakeCost,
      0
    );

    const averageCost = totalCost / total;

    setAnalysisResults({
      averageCost,
      highestCostProduct,
      uniqueProductCount,
      totalRevenue,
    });
    setTotalRevenue(totalRevenue);
  };
  const handleConfirmBill = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/erp/erp/api/bills/generate`,
        {
          products: data.map((order) => ({
            productId: order.productId,
            quantity: order.quantity,
            totalMakeCost: order.totalMakeCost,
          })),
          totalRevenue,
        }
      );

      console.log(response.data.message);

      const confirmed = window.confirm("Bill generated successfully. Proceed to /admin?");
      if (confirmed) {
        window.location.href = "/admin"; // Navigate to /admin upon confirmation
      }
    } catch (error) {
      console.error("Error generating bill:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <div className="bill-generation-container">
      <Header />
      <h2>Bill Generation and Graphs</h2>

      <div className="graph-container">
        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="productName"
              angle={-45}
              interval={0}
              textAnchor="end"
            />
            <YAxis
              dataKey="totalMakeCost"
              label={{
                value: "Total Making Cost",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="totalMakeCost"
              fill="#82ca9d"
              name="Total Making Cost"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bill-summary">
        <h3>Total Bill Summary</h3>
        <p>Total Cost: ৳{totalCost}</p>
      </div>

      <div className="individual-product-details">
        <h3>Highest Making Cost Product</h3>
        {analysisResults && (
          <p>
            Product ID: {analysisResults.highestCostProduct.productId}
            <br />
            Product Name: {analysisResults.highestCostProduct.productName}
            <br />
            Making Cost: ৳{analysisResults.highestCostProduct.totalMakeCost}
          </p>
        )}
      </div>

      <div className="data-analysis">
        <h3>Data Analysis</h3>
        {analysisResults && (
          <p>
            Average Making Cost: ৳{analysisResults.averageCost}
            <br />
            Unique Products Count: {analysisResults.uniqueProductCount}
            <br />
            Total Revenue: ৳{analysisResults.totalRevenue}
          </p>
        )}
        <button onClick={handleConfirmBill}>Confirm Bill Generation</button>
      </div>
    </div>
  );
};

export default BillGenerationComponent;
