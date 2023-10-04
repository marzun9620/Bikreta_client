import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./styles.module.css";

const SalesGraph = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/bar/sales-data"
        ); // Replace with your endpoint
        const data = response.data;
        console.log(data);

        setChartData({
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
        console.error("Error fetching sales data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.mainContent}>
        <div className={styles.chartTitle}></div>
        <div className={styles.chartContainer}>
          {chartData.labels && (
            <Bar
              data={chartData}
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

      <Footer />
    </div>
  );
};

export default SalesGraph;
