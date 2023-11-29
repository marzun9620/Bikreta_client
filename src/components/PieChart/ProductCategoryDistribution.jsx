import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import BASE_URL from "../services/helper";
import "./ProductCategoryDistribution"; // Import the CSS module

function CategoryPieChart() {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Fetch the top 5 categories with the highest growth
    axios
      .get(`${BASE_URL}/bar/erp/highest-growth-categories`)
      .then((response) => {
        setCategoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching top categories:", error);
      });
  }, []);

  // Generate dynamic colors for categories
  const generateCategoryColors = (categories) => {
    const colors = {};
    const categoryNames = categories.map((category) => category.category);

    // Use a color palette or algorithm to generate colors
    categoryNames.forEach((category, index) => {
      const color = `rgba(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256}, 0.6)`;
      colors[category] = color;
    });

    return colors;
  };

  const labels = categoryData.slice(0, 5).map((category) => category.category);
  const backgroundColor = Object.values(generateCategoryColors(categoryData.slice(0, 5)));

  const data = {
    labels,
    datasets: [
      {
        data: categoryData.slice(0, 5).map((category) => category.sales),
        backgroundColor,
      },
    ],
  };

  const options = {
    // Customize chart options (e.g., tooltips, legends, labels)
    responsive: true,
  };

  return (
    <div className="category-pie-chart">
      <div className="chart-container">
        <h2 className="chart-title">Category Sales Growth</h2>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default CategoryPieChart;
