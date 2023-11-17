import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { HorizontalBar } from "react-chartjs-2";
import { Link, useParams } from "react-router-dom";
import io from "socket.io-client";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./styles.module.css";

import BASE_URL from "../services/helper";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const imgRef = useRef(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  const [showCartModal, setShowCartModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [choice, setChoice] = useState("quantity"); // Default choice
  const [quantity, setQuantity] = useState(1);
  const [cartonCount, setCartonCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(1);
  const starCount1 = product?.starCounts?.[1] || 0;
  const starCount2 = product?.starCounts?.[2] || 0;
  const starCount3 = product?.starCounts?.[3] || 0;
  const starCount4 = product?.starCounts?.[4] || 0;
  const starCount5 = product?.starCounts?.[5] || 0;
  const userId = localStorage.getItem("userId");
  const ratingsData = {
    labels: ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"],
    datasets: [
      {
        data: [starCount5, starCount4, starCount3, starCount2, starCount1],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barPercentage: 0.4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0,
          },
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
  };

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

  const socket = io(`${BASE_URL}`);
  const handleAddToCart = () => {
    const userId = localStorage.getItem("userId"); // Fetching the userId from localStorage

    if (!userId) {
      alert("Please login first!"); // Handle the case where a user isn't logged in
      return;
    }
    let totalPriceToAdd;

    if (choice === "quantity") {
      totalPriceToAdd = quantity;
    } else {
      totalPriceToAdd = cartonCount * product.cartonSize;
    }

    axios
      .post(`${BASE_URL}/product/cart/${userId}/add`, {
        userId: userId, // user ID
        productId: product._id, // product ID
        quantity: totalPriceToAdd, // selected quantity
        price: product.unitPrice,
      })
      .then((response) => {
        alert("Added to cart successfully!");
        socket.emit("cartUpdated1", userId);
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
    setShowBuyModal(false);
    setChoice("quantity");
    setQuantity(1);
    setCartonCount(1);
  };

  const handleDirectTransfer = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to make a purchase.");
      return;
    }
    let quantityq;
    if (choice === "quantity") {
      quantityq = quantity;
    } else {
      quantityq = cartonCount * product.cartonSize;
    }
    try {
      const response = await axios.post(`${BASE_URL}/hob1/checkout/bank`, {
        userId: userId,
        productId: product._id,
        quantity: quantityq,
        itemId: 1212,
        permit: 1,
      });

      // Handle the rest of the code as before for successful transactions
      window.location.replace(response.data.url);
    } catch (error) {
      console.error("Error during bank transfer checkout:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/details/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [id]);

  useEffect(() => {
    if (product && product.category) {
      // Check that product exists and has a category
      setLoading(true);
      axios
        .get(`${BASE_URL}/api/products/category/${product.category}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        })
        .finally(() => {
          setLoading(false); // Hide the loading indicator regardless of success or error
        });
    }
  }, [product]);

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

  if (!product) {
    return (
      <>
        <Header />
        <div>Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <div className={styles.productPageContainer}>
      <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
      />
      {showCartModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.cartModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <img
                src={`${BASE_URL}/api/products/image/${product._id}`}
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
                Quantity( সিঙ্গেল পরিমাণ:)
              </label>
              <label>
                <input
                  type="radio"
                  value="carton"
                  checked={choice === "carton"}
                  onChange={() => setChoice("carton")}
                />
                Carton( কার্টন:)
              </label>
            </div>

            <div className={styles.quantityContainer}>
              {choice === "quantity" ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            <div className={styles.totalPrice}>
              Total Price:{" "}
              {choice === "quantity"
                ? `${quantity} x ৳${product.unitPrice} = ৳${(
                    quantity * product.unitPrice
                  ).toFixed(2)}`
                : `${cartonCount} x ৳${
                    product.unitPrice * product.cartonSize
                  } = ৳${(
                    cartonCount *
                    product.unitPrice *
                    product.cartonSize
                  ).toFixed(2)}`}
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

      {showBuyModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.cartModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <img
                src={`${BASE_URL}/api/products/image/${product._id}`}
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
                Quantity( সিঙ্গেল পরিমাণ:)
              </label>
              <label>
                <input
                  type="radio"
                  value="carton"
                  checked={choice === "carton"}
                  onChange={() => setChoice("carton")}
                />
                Carton( কার্টন:)
              </label>
            </div>

            <div className={styles.quantityContainer}>
              {choice === "quantity" ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            <div className={styles.totalPrice}>
              Total Price:{" "}
              {choice === "quantity"
                ? `${quantity} x ৳${product.unitPrice} = ৳${(
                    quantity * product.unitPrice
                  ).toFixed(2)}`
                : `${cartonCount} x ৳${
                    product.unitPrice * product.cartonSize
                  } = ৳${(
                    cartonCount *
                    product.unitPrice *
                    product.cartonSize
                  ).toFixed(2)}`}
            </div>

            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={handleDirectTransfer}
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
        <div className={styles.productImageSectionContainer}>
          <div
            className={styles.productImageSection}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          >
            <img
              ref={imgRef}
              src={`${BASE_URL}/api/products/image/${product._id}`}
              alt={product.productName}
              className={styles.productImageLarge}
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: `${origin.x} ${origin.y}`,
              }}
            />
            <div className={styles.zoomHint}>Hover to zoom</div>
          </div>
          <div className={styles.productPurchaseSection}>
            <button
              className={styles.addToCartBtn}
              onClick={() => setShowCartModal(true)}
            >
              Add to Cart
            </button>
            <button
              className={styles.buyNowBtn}
              onClick={() => setShowBuyModal(true)}
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className={styles.productContentSection}>
          <h1 className={styles.productTitle}>{product.productName}</h1>
          <span className={styles.productCategory}>
            Category: {product.category}
          </span>

          <p className={styles.productDescription}>{product.description}</p>
          <span className={styles.productPrice}>
            {" "}
            Price: ৳{product.unitPrice}
          </span>

          <span className={styles.productPrice}>
            {" "}
            Product Per Carton: {product.cartonSize}
          </span>
          <span className={styles.productPrice}>
            {" "}
            Carton Price: {product.cartonSize * product.unitPrice}
          </span>

          {showCartModal && <showModal product={product} />}
          <div style={{ width: "300px", height: "200px" }}>
            {" "}
            {/* Adjust as needed */}
            <HorizontalBar data={ratingsData} options={chartOptions} />
          </div>
        </div>
      </div>
      <h2>Our Signature Items</h2>
      <div className={styles.productPanel}>
        {productDetails.length > 0 ? (
          productDetails.map((filteredProduct) => (
            <div key={filteredProduct._id} className={styles.productCard}>
              {filteredProduct.totalProducts === 0 ? (
                <div className={`${styles.productLink} ${styles.outOfStock}`}>
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
                              length: Math.floor(filteredProduct.averageRating),
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
          <div className={styles.loadingIndicator}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default ProductDetail;
