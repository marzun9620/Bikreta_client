import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./styles.module.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showCartModal, setShowCartModal] = useState(false);
  const [quantity, setQuantity] = useState(1); // quantity for the product

  const handleAddToCart = () => {
    const userId = localStorage.getItem("userId"); // Fetching the userId from localStorage

    if (!userId) {
      alert("Please login first!"); // Handle the case where a user isn't logged in
      return;
    }

    axios
      .post(`http://localhost:3000/product/cart/${userId}/add`, {
        userId: userId, // user ID
        productId: product._id, // product ID
        quantity: quantity, // selected quantity
        price: product.price,
      })
      .then((response) => {
        alert("Added to cart successfully!");
        setShowCartModal(false);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("Added to cart unsuccessfully!");
        // setShowCartModal(false);
      });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products/details/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [id]);

  if (!product) {
    return (
      <>
        <Header />
        <div>Loading...</div>
        <Footer />
      </>
    );
  }
  const renderStars = (rating) => {
    const filledStars = "★".repeat(Math.round(rating));
    const emptyStars = "☆".repeat(5 - Math.round(rating));
    return filledStars + emptyStars;
  };

  const imageUrl = `http://localhost:3000/api/products/image/${product._id}`;

  return (
    <div className={styles.productPageContainer}>
      <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
      />
      {showCartModal && (
        <>
          <div
            className={styles.modalOverlay}
            onClick={() => setShowCartModal(false)}
          ></div>
          <div className={styles.cartModal}>
            <div className={styles.modalHeader}>
              <img
                src={`http://localhost:3000/api/products/image/${product._id}`}
                alt={product.name}
                className={styles.modalProductImage}
              />
              <h3>Add to Cart - {product.name}</h3>
            </div>

            <div className={styles.quantityContainer}>
              Quantity:
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
              />
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>

            <div>Total Price: ${(quantity * product.price).toFixed(2)}</div>

            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={handleAddToCart}
              >
                Confirm
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowCartModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      <div className={styles.productDetailContainer}>
        <div className={styles.productImageSection}>
          <img
            src={`http://localhost:3000/api/products/image/${product._id}`}
            alt={product.name}
            className={styles.productImageLarge}
          />
          <div>
            <img
              src={`http://localhost:3000/api/products/image/${product._id}`}
              alt={product.name}
              className={styles.productImageLarge}
            />
          </div>
        </div>

        <div className={styles.productContentSection}>
          <div className={styles.productInfoSection}>
            <h2>{product.name}</h2>
            <span>Category: {product.category}</span>
            <div className={styles.productRating}>
              {product &&
                `${renderStars(product.averageRating)} ${
                  product.numberOfRatings
                } reviews`}
            </div>
            <p>{product.description}</p>
            <span className={styles.productPrice}>Price: ${product.price}</span>
            <div className={styles.productPurchaseSection}>
              <button
                className={styles.addToCartBtn}
                onClick={() => setShowCartModal(true)}
              >
                Add to Cart
              </button>
              <button className={styles.buyNowBtn}>Buy Now</button>
            </div>
            {showCartModal && (
              <div className={styles.cartModal}>
                <div className={styles.modalHeader}>
                  <img
                    src={`http://localhost:3000/api/products/image/${product._id}`}
                    alt={product.name}
                    className={styles.modalProductImage}
                  />
                  <h3>Add to Cart - {product.name}</h3>
                </div>

                <div className={styles.quantityContainer}>
                  Quantity:
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
                  />
                  <button onClick={() => setQuantity((prev) => prev + 1)}>
                    +
                  </button>
                </div>

                <div>Total Price: ${(quantity * product.price).toFixed(2)}</div>

                <div className={styles.modalButtons}>
                  <button
                    className={styles.confirmButton}
                    onClick={handleAddToCart}
                  >
                    Confirm
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowCartModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <section className={styles.productFeatures}>
            <h3>Features & Specifications</h3>
            <ul>{/* List out the features and specifications here */}</ul>
          </section>

          <section className={styles.productUsage}>
            <h3>Description & Usage</h3>
            <p>{/* Product usage and care instructions here */}</p>
          </section>

          <section className={styles.customerReviews}>
            <h3>Customer Reviews</h3>
            {/* Display reviews and ratings here */}
          </section>

          <section className={styles.productFAQs}>
            <h3>FAQs</h3>
            {/* List out common questions and answers here */}
          </section>

          <section className={styles.relatedProducts}>
            <h3>You Might Also Like</h3>
            {/* Display related products here */}
          </section>

          <section className={styles.shippingReturns}>
            <h3>Shipping & Returns</h3>
            {/* Shipping and return information */}
          </section>

          <section className={styles.manufacturerInfo}>
            <h3>About the Brand</h3>
            {/* Manufacturer or brand information */}
          </section>

          {/* Add your similar products section here */}
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default ProductDetail;
