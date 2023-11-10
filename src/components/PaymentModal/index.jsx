import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BASE_URL from "../services/helper";
import styles from "./styles.module.css";

function PaymentModal() {
  const [isModalOpen, setModalOpen] = useState(true);
  const [pdfLink, setPdfLink] = useState("");
  const [rating, setRating] = useState(0);
  const { productId, userId } = useParams();

  // Initial value is set to true
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);

    window.open(BASE_URL);
  };

  useEffect(() => {
    // Extract the PDF link from the URL's query parameter
    const url = new URL(window.location.href);
    const pdfLinkParam = url.searchParams.get("pdfLink");
    if (pdfLinkParam) {
      setPdfLink(pdfLinkParam);
    }
  }, []);

  const handleDownloadPDF = () => {
    const fullPDFLink = `${BASE_URL}${pdfLink}`;
    window.open(fullPDFLink, "_blank");
  };

  if (!isModalOpen) return null;

  const handleRatingSubmit = async (e) => {
    e.preventDefault(); // Prevent the form submission
    try {
      const response = await axios.post(
        `${BASE_URL}/api/products/${productId}/rate`,
        {
          userId,
          ratingValue: rating,
        }
      );

      alert("Rating submitted successfully!");
      alert("Thank you for rating!");
      setShowRatingModal(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className={styles.modaloverlay} onClick={handleCloseModal}>
      <div className={styles.modalcontent} onClick={(e) => e.stopPropagation()}>
        {/* Initially, showRatingModal is set to true */}
        <h2>Payment Successful</h2>
        <p>Thank you for shopping with Bikreta!</p>
        {pdfLink && <button onClick={handleDownloadPDF}>Download PDF</button>}
        <Link to="/">
          <button className={styles.closebutton}>Close</button>
        </Link>
      </div>

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

                <label htmlFor={`star-${i + 1}`} className={styles.star}>
                  &#9733;
                </label>
              </React.Fragment>
            ))}
          </div>
          <button onClick={handleRatingSubmit}>Submit Rating</button>
        
        </div>
      )}
    </div>
  );
}

export default PaymentModal;
