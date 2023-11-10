// Cart.js

import {
  faCreditCard,
  faMoneyBillWave,
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

  useEffect(() => {
    if (userId) {
      fetchCartItems(userId);
    }
  }, [userId]);

  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/marzun/cart/marzun/${userId}`
      );
      setCartItems(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleIndividualCheckout = (item) => {
    setCurrentProduct(item);
    setShowModal(true);
  };

  const handleOverallCheckout = async () => {
    try {
      console.log(cartItems[0].product);
      const response = await axios.post(`${BASE_URL}/hob1/checkout/overall`, {
        userId,
        cartItems, // Include the entire cartItems array in the request
      });

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
            <div className="payment-summary">
              <h2 className="payment-summary-title">
                <FontAwesomeIcon icon={faMoneyBillWave} /> Payment Summary
              </h2>
              <div className="payment-info">
                <strong>Subtotal:</strong> $4798.00
              </div>
              <div className="payment-info">
                <strong>Shipping:</strong> $20.00
              </div>
              <div className="payment-info">
                <strong>Total (Incl. taxes):</strong> $4818.00
              </div>
              <Button
                variant="success"
                className="checkout-button"
                onClick={handleOverallCheckout}
              >
                <FontAwesomeIcon icon={faCreditCard} /> Proceed to Checkout
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Total Price: ৳{currentProduct && currentProduct.product.unitPrice}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose a payment method:</p>
          <div>
            <Button
              variant="info"
              onClick={handleBankTransfer}
              className="checkout-button"
            >
              <FontAwesomeIcon icon={faCreditCard} /> Proceed to Payment
            </Button>
          </div>
          <div>{/* Add your rating components or content here */}</div>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Cart;
