import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import styles from './styles.module.css';
import BASE_URL from "../services/helper";

const Cart = ({ userId = localStorage.getItem("userId") }) => {
    const [cartItems, setCartItems] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [showModal, setShowModal] = useState(false); // This remains for checkout
    const [showRatingModal, setShowRatingModal] = useState(false);


    useEffect(() =>       {
        if (userId) {
            axios.get(`${BASE_URL}/marzun/cart/marzun/${userId}`)
                .then(response => {
                    setCartItems(response.data);
                })
                .catch(error => {
                    console.error("Error fetching cart items:", error);
                });
        }
    }, [userId]);


    const handleIndividualCheckout = (item) => {
        console.log("Checking out item:", item);
        setCurrentProduct(item);
        setShowModal(true);    
    };

    const handleRatingSubmit = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/products/${currentProduct.product._id}/rate`, {
                userId,
                ratingValue: rating
            });
            
            alert("Rating submitted successfully!");
            alert('Thank you for rating!');
            setShowRatingModal(false);
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to submit rating. Please try again.");
        }
    };
    

    const handleBankTransfer = async () => {
       // console.log("Current Product:", currentProduct);
        //console.log("Product ID:", currentProduct.product._id);
        //console.log("Quantity:", currentProduct.quantity);

        try {
            const response = await axios.post(`${BASE_URL}/hob1/checkout/bank`, {
                userId: userId,
                productId: currentProduct.product._id,
                quantity: currentProduct.quantity,
                itemId: currentProduct._id
            });
    
            console.log(response.data.transactionId); // changed .body to .data
    
          //  const { transactionId, pdfLink } = response.data;
            
            // Prepend the base URL to the pdfLink
            //const fullPDFLink = `${BASE_URL}${pdfLink}`;
           // setShowModal(false);
           // setShowRatingModal(true); 
            
           // window.open(fullPDFLink, '_blank');
           // alert(`Transaction successful! Your transaction ID is: ${transactionId}.`);
           window.location.replace(response.data.url);
        } catch (error) {
            console.error("Error during bank transfer checkout:", error);
            alert('Transaction failed. Please try again.');
        }
    
    };

    return (
        <div>
            <Header 
                userName={localStorage.getItem("userName")}
                userId={localStorage.getItem("userId")}
                cartItemCount={2}
            />
            <div className={styles.cartPage}>
                <h2 className={styles.cartTitle}>Your Cart</h2>
                <div className={styles.cartContent}>
    {cartItems && cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
    ) : (
        cartItems && cartItems.map(item => (
            <div key={item._id.$oid} className={styles.cartItem}>
                <img src={`${BASE_URL}/api/products/image/${item.product._id}`} alt="Product" className={styles.productImage} />
                <div className={styles.productDetails}>
                    <span className={styles.productName}>Product ID: {item.product.name}</span>
                    <span className={styles.productPrice}>৳{item.price}</span>
                    <span className={styles.productQuantity}>Quantity: {item.quantity}</span>
                    <span className={styles.totalPrice}>Total: ৳{item.price* item.quantity}</span>
                </div>
                <button className={styles.checkoutButton} onClick={() => handleIndividualCheckout(item)}>Checkout</button>
            </div>
        ))
    )}
</div>

                
                {showModal && (
                    <div className={styles.modal}>
                        <h3>Total Price: ${currentProduct && currentProduct.unitPrice}</h3>
                        Choose a payment method:
                        <button onClick={handleBankTransfer}>Bank Transfer</button>
                        <button onClick={handleBankTransfer}>Bkash</button>
                        <button onClick={handleBankTransfer}>Nagad</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                        <div className={styles.ratingSection}>

    
    
</div>

                    </div>
                    
                )}
         {showRatingModal && (
      <div className={styles.ratingModal}>
      <h3>Rate the Product:</h3>
      <div className={styles.starRating}>
          {[...Array(5)].map((_, i) => (
              <React.Fragment key={i}>
                  <input 
                      type="radio" 
                      name="rating" 
                      id={`star-${i + 1}`} 
                      value={i + 1} 
                      onChange={(e) => setRating(e.target.value)}
                  />
                  <label htmlFor={`star-${i + 1}`} className={styles.star}>&#9733;</label>
              </React.Fragment>
          ))}
      </div>
        <button onClick={handleRatingSubmit}>Submit Rating</button>
        <button onClick={() => setShowRatingModal(false)}>Close</button>
    </div>
)}
            </div>
            <Footer />
        </div>
    );
}

export default Cart;
