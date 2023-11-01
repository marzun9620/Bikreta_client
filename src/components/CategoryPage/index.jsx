import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./styles.module.css";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(500);
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    // Fetch products based on the selected category
    axios
      .get(`http://localhost:3000/api/products/category/${category}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [category]);

  useEffect(() => {
    // Fetch discount and offer details for all products
    if (products.length > 0) {
      const productDetailPromises = products.map((product) => {
        return axios
          .get(
            `http://localhost:3000/product/api/discount-and-offer/${product._id}`
          )
          .then((response) => ({
            ...product,
            discount: response.data.discount,
            offer: response.data.offer,
          }))
          .catch((error) => {
            console.error("Error fetching discount and offer:", error);
          });
      });

      Promise.all(productDetailPromises)
        .then((details) => {
          console.log(details);
          setProductDetails(details);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
        });
    }
  }, [products]);

  return (
    <>
      <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
      />
      <div className={styles.container}>
        <div className={styles.filterPanel}>
          <h3>Filter by:</h3>
          <div className={styles.filterGroup}>
            <label>Price Range: ৳{priceFilter}</label>
            <input
              type="range"
              min="0"
              max="500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Rating:</label>
            <select>
              <option value="0">All</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Brand:</label>
            <select>
              <option value="all">All Brands</option>
              <option value="brand1">Brand 1</option>
              <option value="brand2">Brand 2</option>
              <option value="brand3">Brand 3</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Size:</label>
            <select>
              <option value="all">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          {/* Add more filter options as needed */}
          <div className={styles.filterGroup}>
            <label>Payment Method:</label>
            <select>
              <option value="all">All Methods</option>
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash-on-delivery">Cash on Delivery</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Location:</label>
            <select>
              <option value="all">All Locations</option>
              <option value="city1">City 1</option>
              <option value="city2">City 2</option>
              <option value="city3">City 3</option>
            </select>
          </div>
        </div>

        <div className={styles.productPanel}>
          {productDetails.length > 0 ? (
            productDetails
              .filter((product) => product.unitPrice <= priceFilter)
              .map((filteredProduct) => (
                <div key={filteredProduct._id} className={styles.productCard}>
                  <Link
                    to={`/product/${filteredProduct._id}`}
                    className={styles.productLink}
                  >
                    <div className={styles.imageContainer}>
                      <img
                        src={`http://localhost:3000/api/products/image/${filteredProduct._id}`}
                        alt={filteredProduct.productName}
                        className={styles.productImage}
                      />
                    </div>
                    <h2 className={styles.productTitle}>
                      {filteredProduct.name}
                    </h2>
                    <div className={styles.productPrice}>
                      <span className={styles.actualPrice}>
                        Price: ৳{filteredProduct.unitPrice}
                      </span>
                      {filteredProduct.discount && (
                        <span className={styles.discountPrice}>
                          Price after discount: ৳
                          {filteredProduct.unitPrice -
                            (filteredProduct.unitPrice *
                              filteredProduct.discount) /
                              100}
                        </span>
                      )}
                    </div>
                    {filteredProduct.discount && (
                      <p className={styles.productDiscount}>
                        Discount: {filteredProduct.discount}%
                      </p>
                    )}
                    {filteredProduct.offer && (
                      <p className={styles.productOffer}>
                        Offer:{" "}
                        <span className={styles.offerDescription}>
                          {filteredProduct.offer}
                        </span>
                      </p>
                    )}
                    <div className={styles.productRating}>
                      {filteredProduct.averageRating}
                      {Array.from({
                        length: Math.floor(filteredProduct.averageRating),
                      }).map((_, i) => (
                        <span key={i} className={styles.starSymbol}>
                          &#9733;{" "}
                        </span>
                      ))}
                    </div>
                  </Link>
                </div>
              ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
