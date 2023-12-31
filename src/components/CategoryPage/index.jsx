import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import BASE_URL from "../services/helper";
import styles from "./styles.module.css";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(500);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/products/category/${category}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false); // Hide the loading indicator regardless of success or error
      });
  }, [category]);

  useEffect(() => {
    if (products.length > 0) {
      setLoading(true);
      const productDetailPromises = products.map((product) => {
        return axios
          .get(`${BASE_URL}/product/api/discount-and-offer/${product._id}`)
          .then((response) => ({
            ...product,
            discount: response.data.discount,
            offer: response.data.offer,
          }))
          .catch((error) => {
            console.error("Error fetching discount and offer:", error);
          })
          .finally(() => {
            setLoading(false); // Hide the loading indicator regardless of success or error
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          {loading ? ( // Show loading indicator while loading
            <div className={styles.loadingIndicator}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : productDetails.length > 0 ? (
            productDetails
              .filter((product) => product.unitPrice <= priceFilter)
              .map((filteredProduct) => (
                <div key={filteredProduct._id} className={styles.productCard}>
                  {filteredProduct.totalProducts === 0 ? (
                    <div
                      className={`${styles.productLink} ${styles.outOfStock}`}
                    >
                      <div className={styles.imageContainer}>
                        {/* Display image or a placeholder for out-of-stock items */}
                        <img
                          src={`${BASE_URL}/api/products/image/${filteredProduct._id}`}
                          alt={filteredProduct.productName}
                          className={styles.productImage}
                        />
                      </div>
                      <h2 className={styles.productTitle}>
                        {filteredProduct.productName}
                      </h2>
                      <p
                        className={`${styles.outOfStockMessage} ${styles.productMessage}`}
                      >
                        Out of Stock
                      </p>
                    </div>
                  ) : (
                    <Link
                      to={`/product/${filteredProduct._id}`}
                      className={styles.productLink}
                    >
                      <div className={styles.imageContainer}>
                        {/* Display image */}
                        <img
                          src={`${BASE_URL}/api/products/image/${filteredProduct._id}`}
                          alt={filteredProduct.productName}
                          className={styles.productImage}
                        />
                      </div>
                      {/* ... rest of the existing JSX code ... */}
                      <h2 className={styles.productTitle}>
                        {filteredProduct.productName}
                      </h2>

                      {filteredProduct.totalProducts === 0 ? (
                        <p className={styles.outOfStock}>Out of Stock</p>
                      ) : (
                        <div>
                          <div className={styles.productPrice}>
                            <span
                              className={`${styles.actualPrice} ${
                                filteredProduct.discount === 0
                                  ? styles.noDiscount
                                  : ""
                              }`}
                            >
                              Price: ৳
                              <span className={styles.priceDigits}>
                                {filteredProduct.unitPrice}
                              </span>
                            </span>
                            {filteredProduct.discount !== 0 && (
                              <span className={styles.discountPrice}>
                                Price after discount: ৳
                                <span className={styles.priceDigitsBlack}>
                                  {filteredProduct.unitPrice -
                                    (filteredProduct.unitPrice *
                                      filteredProduct.discount) /
                                      100}
                                </span>
                              </span>
                            )}
                          </div>

                          {filteredProduct.discount > 0 && (
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
                            {filteredProduct.averageRating > 0 ? (
                              <>
                                {filteredProduct.averageRating}
                                {Array.from({
                                  length: Math.floor(
                                    filteredProduct.averageRating
                                  ),
                                }).map((_, i) => (
                                  <span key={i} className={styles.starSymbol}>
                                    &#9733;{" "}
                                  </span>
                                ))}
                              </>
                            ) : (
                              "No one has rated yet"
                            )}
                          </div>
                        </div>
                      )}
                    </Link>
                  )}
                </div>
              ))
          ) : (
            <p>Products Loading.</p>
          )}
        </div>
        <div className={styles.sidePanel}>
          <h3>Side Panel</h3>
          <p>
            This is some sample content for the side panel. You can add any
            information or components you want here.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
