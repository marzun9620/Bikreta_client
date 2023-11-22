import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import io from "socket.io-client";
import "./RealTimeGraphs.css"; // Import the CSS file
const socket = io("http://localhost:3000", { transports: ["websocket"] });

const RealTimeGraphs = () => {
  const [data, setData] = useState({
    purchaseData: [],
    productData: [],
    discountData: [],
    offerData: [],
  });

  useEffect(() => {
    socket.on("dataUpdate", (newData) => {
      //console.log("Received new data:", newData);
      setData(newData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
//sales trend sover time
  const analyzeSalesTrends = () => {
    const trace = {
      x: data.purchaseData.map((item) => item.orderPlacedDate),
      y: data.purchaseData.map((item) => item.totalPaid),
      type: "scatter",
    };

    const layout = {
      title: "Sales Trends Over Time",
      xaxis: {
        title: "Date",
      },
      yaxis: {
        title: "Total Sales Amount",
      },
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };


  //average rating by category

  const analyzeProductPerformance = () => {
    const trace = {
      x: data.productData.map((item) => item.category),
      y: data.productData.map((item) => item.averageRating),
      type: "bar",
    };

    const layout = {
      title: "Average Rating by Category",
      xaxis: {
        title: "Category",
      },
      yaxis: {
        title: "Average Rating",
      },
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };

  const analyzeUserBehavior = () => {
    const trace = {
      x: data.purchaseData.map((item) => item.userId),
      type: "histogram",
    };

    const layout = {
      title: "User Purchase Behavior",
      xaxis: {
        title: "User ID",
      },
      yaxis: {
        title: "Number of Purchases",
      },
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };

  const analyzeOfferDiscountEffectiveness = () => {
    const trace = {
      x: data.discountData.map((item) => item.category),
      y: data.discountData.map((item) => item.discountPercentage),
      type: "bar",
    };

    const layout = {
      title: "Average Discount Percentage by Category",
      xaxis: {
        title: "Category",
      },
      yaxis: {
        title: "Average Discount Percentage",
      },
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };

  const analyzeDeliveryPerformance = () => {
    const trace = {
      x: data.purchaseData.map((item) => item.deliveryDelay),
      type: "histogram",
    };

    const layout = {
      title: "Delivery Delay Distribution",
      xaxis: {
        title: "Number of Days Delayed",
      },
      yaxis: {
        title: "Number of Purchases",
      },
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };

  const analyzeCategory = () => {
    const trace = {
      x: data.purchaseData.map((item) => item.category),
      type: "bar",
    };

    const layout = {
      title: "Purchase by Category",
      xaxis: {
        title: "Category",
      },
      yaxis: {
        title: "Number of Purchases",
      },
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };

  const analyzeProfitability = () => {
    const trace = {
      x: data.productData.map((item) => item.productName),
      y: data.purchaseData.map(
        (item) => item.totalPaid - item.unitMakeCost * item.quantity
      ),
      type: "bar",
    };

    const layout = {
      title: "Profitability by Product",
      xaxis: {
        title: "Product Name",
      },
      yaxis: {
        title: "Profit",
      },
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };

  const analyzeUserSatisfaction = () => {
    const trace = {
      x: data.productData.map((item) => item.weighted_avg_rating),
      type: "histogram",
    };

    const layout = {
      title: "Weighted Average Rating Distribution",
      xaxis: {
        title: "Weighted Average Rating",
      },
      yaxis: {
        title: "Number of Products",
      },
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };

  const performCorrelationAnalysis = () => {
    const correlationMatrix = getCorrelationMatrix(
      data.purchaseData,
      data.productData,
      data.discountData,
      data.offerData
    );

    const trace = {
      z: correlationMatrix,
      x: ["quantity", "totalPaid", "unitPrice", "discountPercentage"],
      y: ["quantity", "totalPaid", "unitPrice", "discountPercentage"],
      type: "heatmap",
    };

    const layout = {
      title: "Correlation Analysis",
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };

  const performCustomerSegmentation = () => {
    const trace = {
      x: data.purchaseData.map((item) => item.quantity),
      y: data.purchaseData.map((item) => item.totalPaid),
      mode: "markers",
      type: "scatter",
      marker: { color: data.purchaseData.map((item) => item.segment) },
    };

    const layout = {
      title: "Customer Segmentation",
      xaxis: {
        title: "Quantity Purchased",
      },
      yaxis: {
        title: "Total Amount Paid",
      },
    };

    const figure = { data: [trace], layout };
    return <Plot data={[trace]} layout={layout} />;
  };

  const getCorrelationMatrix = (
    purchaseData,
    productData,
    discountData,
    offerData
  ) => {
    // Replace this with the actual logic to calculate the correlation matrix
    // Example code:
    const correlationMatrix = [
      [1, 0.8, 0.6, 0.4],
      [0.8, 1, 0.7, 0.5],
      [0.6, 0.7, 1, 0.3],
      [0.4, 0.5, 0.3, 1],
    ];

    return correlationMatrix;
  };

  return (
    <div className="real-time-graphs-container">
      <div className="graph-container">{analyzeSalesTrends()}</div>
      <div className="graph-container">{analyzeProductPerformance()}</div>
      <div className="graph-container">{analyzeUserBehavior()}</div>
      <div className="graph-container">
        {analyzeOfferDiscountEffectiveness()}
      </div>
      <div className="graph-container">{analyzeDeliveryPerformance()}</div>
      <div className="graph-container">{analyzeCategory()}</div>
      <div className="graph-container">{analyzeProfitability()}</div>
      <div className="graph-container">{analyzeUserSatisfaction()}</div>
      <div className="graph-container">{performCorrelationAnalysis()}</div>
      <div className="graph-container">{performCustomerSegmentation()}</div>
    </div>
  );
};

export default RealTimeGraphs;
