import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import Header from "../AdminHeader";
import Footer from "../Footer";
import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3000";

const AdminPanel = () => {
  const [locationChartData, setLocationChartData] = useState({});
  const [timeChartData, setTimeChartData] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalMakingCost, setTotalMakingCost] = useState(0);
  const [runningOrders, setRunningOrders] = useState(0);
  const [customersAdded, setCustomersAdded] = useState(0);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Sales by Location data
        const locationResponse = await axios.get(
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
        const timeResponse = await axios.get(
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
        let response;

        // Fetching Total Cost
        response = await axios.get(`${BASE_URL}/erp/total-cost`);
        setTotalCost(response.data.totalCost);
        let xx = response.data.totalCost;
        // Fetching Total Making Cost
        response = await axios.get(`${BASE_URL}/erp/total-making-cost`);
        setTotalMakingCost(response.data.totalMakingCost);
        let yy = response.data.totalMakingCost;
        console.log(xx, yy);
        setTotalProfit(xx - yy);
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

  return (
    <div className={styles.container}>
      <Header />

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
    
    </div>
  );
};

export default AdminPanel;
