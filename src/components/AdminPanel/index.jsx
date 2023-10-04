import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./styles.module.css";

const SalesGraph = () => {
  const [locationChartData, setLocationChartData] = useState({});
  const [timeChartData, setTimeChartData] = useState({});

  useEffect(() => {
    async function fetchLocationData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/bar/sales-data"
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
          "http://localhost:3000/bar/api/sales/weekly"
        );
        const data = response.data;
        console.log(data);

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

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.mainContent}>
        <div className={styles.graphsContainer}>
          <div className={styles.individualGraph}>
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
            <div className={styles.individualGraph}>
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

      <Footer />
    </div>
  );
};

export default SalesGraph;
