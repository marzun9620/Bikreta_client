// Cart.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Modal, Card } from "react-bootstrap";
import Header from "../Header";
import Footer from "../Footer";
import BASE_URL from "../services/helper";
import styles from "./styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
      const response = await axios.get(`${BASE_URL}/marzun/cart/marzun/${userId}`);
      setCartItems(response.data);
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
      const response = await axios.post(`${BASE_URL}/hob1/checkout/overall`, {
        userId,
        cartItems: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          itemId: item._id,
          permit: 2,
        })),
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
      <Header userName={localStorage.getItem("userName")} userId={localStorage.getItem("userId")} cartItemCount={2} />
      <Container className={styles.cartContainer}>
        <h2 className={styles.cartTitle}>Your Shopping Cart</h2>
        <Row xs={1} md={2} lg={3} className={styles.cartItems}>
          {cartItems.map((item) => (
            <Col key={item._id.$oid} className="mb-3">
              <Card>
                <Card.Img variant="top" src={`${BASE_URL}/api/products/image/${item.product._id}`} />
                <Card.Body>
                  <Card.Title>{item.product.name}</Card.Title>
                  <Card.Text>
                    Price: ৳{item.price * item.quantity}
                    <br />
                    Quantity: {item.quantity}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleIndividualCheckout(item)}>
                    Checkout
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Button variant="success" className={styles.checkoutButton} onClick={handleOverallCheckout}>
          Proceed to Checkout
        </Button>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Total Price: ৳{currentProduct && currentProduct.product.unitPrice}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose a payment method:</p>
          <div className={styles.paymentOptions}>
            <Button variant="info" onClick={handleBankTransfer}>
              Proceed to Payment
            </Button>
          </div>
          <div className={styles.ratingSection}>{/* Add your rating components or content here */}</div>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Cart;
