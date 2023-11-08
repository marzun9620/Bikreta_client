import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../services/helper";
import styles from "./BestSoldProducts.module.css";

const ProductCarousel = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Function to load the best-selling products
  const loadBestProducts = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/api/monthly-best-products`
      );
      console.log(response.data);
      setBestProducts(response.data);
    } catch (error) {
      console.error("Error loading best-selling products:", error);
    }
  };

  // Function to automatically move to the next product
  const autoTransition = () => {
    setCurrentProductIndex((currentProductIndex + 1) % bestProducts.length);
  };

  // Automatically transition to the next product every 5 seconds
  useEffect(() => {
    const interval = setInterval(autoTransition, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentProductIndex, bestProducts]);

  useEffect(() => {
    loadBestProducts();
  }, []);

  return (
    <div className={styles.bestProductsContainer}>
      <h2>Monthly Best-Selling Products</h2>
      <div className={styles.productCarousel}>
        {bestProducts.length > 0 && (
          <div className={styles.productCard}>
            <img
              src={`${BASE_URL}/api/products/image/${bestProducts[currentProductIndex]._id}`}
              alt={bestProducts[currentProductIndex].name}
              className={styles.productImage}
            />
            <div className={styles.productDetails}>
              <h3>
                {
                  bestProducts[currentProductIndex].productDetails[0]
                    .productName
                }
              </h3>
              <p>
                Price: ৳
                {bestProducts[currentProductIndex].productDetails[0].unitPrice}
              </p>
              <p>Sales: {bestProducts[currentProductIndex].totalSales}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
