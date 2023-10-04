import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.column}>
          <h3>Shopping</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">New Arrivals</a>
            </li>
            <li>
              <a href="/sales">Sales</a>
            </li>
            <li>
              <a href="/brands">Brands</a>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>About Us</h3>
          <ul>
            <li>
              <a href="/about">Our Story</a>
            </li>
            <li>
              <a href="/careers">Careers</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/reviews">Customer Reviews</a>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>Support</h3>
          <ul>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/shipping">Shipping & Returns</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>Newsletter</h3>
          <p>
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>

      <div className={styles.footerMid}>
        <h3>Follow Us</h3>
        <div className={styles.socialLinks}>
          <a href="#">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2023 BIKRETA. All Rights Reserved.</p>
        <ul className={styles.footerNav}>
        <li>
            <a href="/admin">ERP</a>
          </li>
          <li>
            <a href="/terms">MES</a>
          </li>
          <li>
            <a href="/terms">Terms & Conditions</a>
          </li>
          <li>
            <a href="/disclaimer">Disclaimer</a>
          </li>
          <li>
            <a href="/site-map">Site Map</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;