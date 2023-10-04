import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./styles.module.css";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(500); // Assuming 500 is the maximum price in the range

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products/category/${category}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [category]);

  return (
    <>
      <Header />

      <div className={styles.container}>
        <div className={styles.filterPanel}>
          <h3>Filter by:</h3>
          <div className={styles.filterGroup}>
            <label>Price Range: ${priceFilter}</label>
            <input
              type="range"
              min="0"
              max="500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            />
          </div>
          {/* Add more filter options as you develop them */}
        </div>
        <div className={styles.productPanel}>
          {products
            .filter((product) => product.price <= priceFilter)
            .map((filteredProduct) => (
              <div key={filteredProduct._id} className={styles.productCard}>
                <div className={styles.imageContainer}>
                  <img
                    src={`http://localhost:3000/api/products/image/${filteredProduct._id}`}
                    alt={filteredProduct.name}
                    className={styles.productImage}
                  />
                </div>
                <h2 className={styles.productTitle}>{filteredProduct.name}</h2>
                <span className={styles.productPrice}>
                  Price: ${filteredProduct.price}
                </span>
                <p className={styles.productDescription}>
                  {filteredProduct.description}
                </p>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoryPage;
