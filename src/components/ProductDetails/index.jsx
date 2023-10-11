import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./styles.module.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const imgRef = useRef(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  const [showCartModal, setShowCartModal] = useState(false);
  const [choice, setChoice] = useState("quantity"); // Default choice
  const [quantity, setQuantity] = useState(1);
  const [cartonCount, setCartonCount] = useState(1);

  const handleMouseMove = (event) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setOrigin({ x: `${x}%`, y: `${y}%` });
  };

  const handleMouseEnter = () => {
    setZoomScale(2); // You can adjust the zoom level as needed
  };

  const handleMouseLeave = () => {
    setZoomScale(1);
  };

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

  const closeModal = () => {
    setShowCartModal(false);
    setChoice("quantity");
    setQuantity(1);
    setCartonCount(1);
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

  return (
    <div className={styles.productPageContainer}>
      <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
        cartItemCount={2}
      />
      {showCartModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.cartModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <img
                src={`http://localhost:3000/api/products/image/${product._id}`}
                alt={product.name}
                className={styles.modalProductImage}
              />
              <h3>Add to Cart - {product.productName}</h3>
            </div>

            <div className={styles.choiceContainer}>
              <label>
                <input
                  type="radio"
                  value="quantity"
                  checked={choice === "quantity"}
                  onChange={() => setChoice("quantity")}
                />
                Quantity
              </label>
              <label>
                <input
                  type="radio"
                  value="carton"
                  checked={choice === "carton"}
                  onChange={() => setChoice("carton")}
                />
                Carton
              </label>
            </div>

            {choice === "quantity" && (
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
            )}

            {choice === "carton" && (
              <div className={styles.quantityContainer}>
                Cartons:
                <button
                  onClick={() =>
                    setCartonCount((prev) => Math.max(1, prev - 1))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={cartonCount}
                  onChange={(e) =>
                    setCartonCount(Math.max(1, Number(e.target.value)))
                  }
                />
                <button onClick={() => setCartonCount((prev) => prev + 1)}>
                  +
                </button>
              </div>
            )}

            <div className={styles.totalPrice}>
              Total Price: ৳{" "}
              {(
                (choice === "quantity"
                  ? quantity
                  : cartonCount * product.cartonSize) * product.unitPrice
              ).toFixed(2)}
            </div>

            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={handleAddToCart}
              >
                Confirm
              </button>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.productDetailContainer}>
        <div
          className={styles.productImageSection}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <img
            ref={imgRef}
            src={`http://localhost:3000/api/products/image/${product._id}`}
            alt={product.name}
            className={styles.productImageLarge}
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: `${origin.x} ${origin.y}`,
            }}
          />
          <div className={styles.zoomHint}>Hover to zoom</div>
        </div>

        <div className={styles.productContentSection}>
          <h1 className={styles.productTitle}>{product.productName}</h1>
          <span className={styles.productCategory}>
            Category: {product.category}
          </span>

          <div className={styles.productRating}>
            {`${renderStars(product.averageRating)} ${
              product.numberOfRatings
            } reviews`}
          </div>

          <p className={styles.productDescription}>{product.description}</p>
          <span className={styles.productPrice}>
            {" "}
            Price: ৳{product.unitPrice}
          </span>
          <span className={styles.productPrice}>
            {" "}
            Product Per Carton: {product.cartonSize}
          </span>

          <div className={styles.productPurchaseSection}>
            <button
              className={styles.addToCartBtn}
              onClick={() => setShowCartModal(true)}
            >
              Add to Cart
            </button>
            <button className={styles.buyNowBtn}>Buy Now</button>
          </div>

          {showCartModal && <showModal product={product} />}
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default ProductDetail;
