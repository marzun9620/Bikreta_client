import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import styles from './styles.module.css';

const Cart = ({ userId = localStorage.getItem("userId") }) => {
    const [cartItems, setCartItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3000/marzun/cart/marzun/${userId}`)
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

    const handleBankTransfer = async () => {
        console.log("Current Product:", currentProduct);
        console.log("Product ID:", currentProduct.product._id);
        console.log("Quantity:", currentProduct.quantity);

        try {
            const response = await axios.post(`http://localhost:3000/hob1/checkout/bank`, {
                userId: userId,
                productId: currentProduct.product._id,
                quantity: currentProduct.quantity,
                itemId: currentProduct._id
            });
    
            console.log(response.data); // changed .body to .data
    
            const { transactionId, pdfLink } = response.data;
            
            // Prepend the base URL to the pdfLink
            const fullPDFLink = `http://localhost:3000${pdfLink}`;
            
            window.open(fullPDFLink, '_blank');
            alert(`Transaction successful! Your transaction ID is: ${transactionId}.`);
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
            />
            <div className={styles.cartPage}>
                <h2 className={styles.cartTitle}>Your Cart</h2>
                <div className={styles.cartContent}>
    {cartItems && cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
    ) : (
        cartItems && cartItems.map(item => (
            <div key={item._id.$oid} className={styles.cartItem}>
                <img src={`http://localhost:3000/api/products/image/${item.product._id}`} alt="Product" className={styles.productImage} />
                <div className={styles.productDetails}>
                    <span className={styles.productName}>Product ID: {item.product.name}</span>
                    <span className={styles.productPrice}>${item.price}</span>
                    <span className={styles.productQuantity}>Quantity: {item.quantity}</span>
                    <span className={styles.totalPrice}>Total: ${item.price* item.quantity}</span>

                </div>
                <button className={styles.checkoutButton} onClick={() => handleIndividualCheckout(item)}>Checkout</button>
            </div>
        ))
    )}
</div>

                
                {showModal && (
                    <div className={styles.modal}>
                        <h3>Total Price: ${currentProduct && currentProduct.price.$numberInt}</h3>
                        Choose a payment method:
                        <button onClick={handleBankTransfer}>Bank Transfer</button>
                        <button onClick={handleBankTransfer}>Bkash</button>
                        <button onClick={handleBankTransfer}>Nagad</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Cart;
