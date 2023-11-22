// Cart.js

import {
  faCreditCard,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import Footer from "../Footer";
import Header from "../Header";
import BASE_URL from "../services/helper";
import "./cart.css"; // Import the CSS file

const Cart = ({ userId = localStorage.getItem("userId") }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalIndividual, setshowModalIndividual] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(20);
  const [total, setTotal] = useState(0);
  const [checkoutDetails, setCheckoutDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (userId) {
      fetchCartItems(userId);
    }
  }, [userId]);
//hello
  const fetchCartItems = async (userId) => {
    try {
      setLoading(true);


      const response = await axios.get(
        `${BASE_URL}/marzun/cart/marzun/${userId}`
      );
      setCartItems(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleIndividualCheckout = (item) => {
    console.log(item);
    setCurrentProduct(item);
    setshowModalIndividual(true);
  };

  const handleOverallCheckout = async () => {
    try {
      const sum = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const response = await axios.post(`${BASE_URL}/hob1/checkout/overall`, {
        userId,
        cartItems,
        sum, // Include the sum in the request
      });
      console.log(response.data);
      window.location.replace(response.data.url);
    } catch (error) {
      console.error("Error during overall checkout:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  const handleBankTransfer = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/hob1/checkout/bank`, {
        userId,
        productId: currentProduct.product._id,
        quantity: currentProduct.quantity,
        itemId: currentProduct._id,
        permit: 2,
      });

      window.location.replace(response.data.url);
    } catch (error) {
      console.error("Error during bank transfer checkout:", error);
      alert("Transaction failed. Please try again.");
    }
  };
  const calculateTotals = () => {
    // Calculate the subtotal from cart items
    const calculatedSubtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // You can replace the shipping logic with your actual shipping cost
    const shipping = 20; // Assuming a fixed shipping cost

    // Calculate the total by adding subtotal and shipping
    const calculatedTotal = calculatedSubtotal + shipping;

    // Update state with the calculated values
    setSubtotal(calculatedSubtotal);
    setShipping(shipping);
    setTotal(calculatedTotal);
  };
  const Modal1 = () => {
    // Set the checkout details to state
    setCheckoutDetails(cartItems);

    // Open the modal
    setShowModal(true);
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems(userId);
    }
  }, [userId]);

  useEffect(() => {
    // Recalculate totals whenever cartItems change
    calculateTotals();
  }, [cartItems]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
        cartItemCount={2}
      />
      <Container fluid className="container">
        <Row>
          {/* Left side: Product List */}
          <Col xs={12} md={8}>
            <h2 className="cart-title">
              <FontAwesomeIcon icon={faShoppingCart} /> Your Shopping Cart
            </h2>
            {cartItems.map((item) => (
              <Card key={item._id.$oid} className="product-card">
                <Card.Img
                  variant="top"
                  src={`${BASE_URL}/api/products/image/${item.product._id}`}
                />
                <Card.Body>
                  <Card.Title>{item.product.name}</Card.Title>
                  <Card.Text>
                    <strong>Price:</strong> ৳{item.price * item.quantity}
                    <br />
                    <strong>Quantity:</strong> {item.quantity}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleIndividualCheckout(item)}
                    className="checkout-button-indivigual"
                  >
                    Checkout
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Right side: Payment Summary */}
          <Col xs={12} md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Cart Summary</Card.Title>
                <Card.Text>
                  <strong>Subtotal:</strong> ৳{subtotal}
                </Card.Text>
                <Card.Text>
                  <strong>Shipping:</strong> ৳{shipping}
                </Card.Text>
                <Card.Text>
                  <strong>Total (Incl. taxes):</strong> ৳{total}
                </Card.Text>
                <Button
                  variant="success"
                  className="checkout-button"
                  onClick={Modal1}
                >
                  <FontAwesomeIcon icon={faCreditCard} /> Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showModalIndividual}
        onHide={() => setshowModalIndividual(false)}
      >
        {currentProduct && (
          <React.Fragment>
            <Modal.Header closeButton>
              <Modal.Title className="modal-title">
                Product Details: {currentProduct.product.productName}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {currentProduct.product && (
                <>
                  <div className="product-details-container">
                    <div className="product-image-container">
                      <img
                        src={`${BASE_URL}/api/products/image/${currentProduct.product._id}`}
                        alt={currentProduct.product.productName}
                        className="product-image"
                      />
                    </div>
                    <div className="product-info">
                      <p>
                        <strong>Category:</strong>{" "}
                        {currentProduct.product.category}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {currentProduct.product.description}
                      </p>
                      <p>
                        <strong>Unit Price:</strong> ৳
                        {currentProduct.product.unitPrice}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {currentProduct.quantity}
                      </p>
                      <p>
                        <strong>Total Price:</strong> ৳{currentProduct.price}
                      </p>
                      <p>
                        <strong>Is Bought:</strong>{" "}
                        {currentProduct.isBought ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="info"
                    onClick={handleBankTransfer}
                    className="checkout-button"
                  >
                    <FontAwesomeIcon icon={faCreditCard} /> Proceed to Payment
                  </Button>
                </>
              )}
            </Modal.Body>
          </React.Fragment>
        )}
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Checkout Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkoutDetails.map((item) => (
            <div key={item._id} className="checkout-item">
              <div className="item-details">
                <p className="item-name">{item.product.name}</p>
                <p className="item-price">
                  <strong>Price:</strong> ৳{item.price * item.quantity}
                </p>
                <p className="item-quantity">
                  <strong>Quantity:</strong> {item.quantity}
                </p>
              </div>
              <img
                src={`${BASE_URL}/api/products/image/${item.product._id}`}
                alt={item.product.name}
                className="item-image"
              />
            </div>
          ))}
          <div className="total-price">
            <p>
              <strong>Shipping:</strong> ৳20
            </p>
            <p>
              <strong>Total (Incl. taxes):</strong> ৳{subtotal + 20}
            </p>
          </div>
          <Button
            variant="info"
            onClick={handleOverallCheckout}
            className="checkout-button"
          >
            <FontAwesomeIcon icon={faCreditCard} /> Proceed to Payment
          </Button>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Cart;
