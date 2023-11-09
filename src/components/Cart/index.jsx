import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import styles from './styles.module.css';
import BASE_URL from "../services/helper";

const Cart = ({ userId = localStorage.getItem("userId") }) => {
    const [cartItems, setCartItems] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
   
    const [showModal, setShowModal] = useState(false); // This remains for checkout



    useEffect(() =>       {
        if (userId) {
            axios.get(`${BASE_URL}/marzun/cart/marzun/${userId}`)
                .then(response => {
                    setCartItems(response.data);
                    console.log(cartItems);
                })
                .catch(error => {
                    console.error("Error fetching cart items:", error);
                });
        }
    }, [userId]);


    const handleIndividualCheckout = (item) => {
        console.log("Checking out item:", item);
        setCurrentProduct(item);
        //console.log(item);
        setShowModal(true);    
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
                itemId: currentProduct._id,
                permit:2
            });
    
            //console.log(response.data.transactionId); // changed .body to .data
    
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
                    <span className={styles.productPrice}>৳{item.price * item.quantity}</span>
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
    <h3>Total Price: ৳{currentProduct && currentProduct.product.unitPrice}</h3>
    <p>Choose a payment method:</p>
    <div className={styles.paymentOptions}>
      <button onClick={handleBankTransfer}>Proceed to Payment</button>
    </div>
    <div className={styles.ratingSection}>
      {/* Add your rating components or content here */}
    </div>
  </div>
)}

              </div>
            <Footer />
        </div>
    );
}

export default Cart;
