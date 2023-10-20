import React, { useState } from 'react';
import styles from "./styles.module.css";

function PaymentModal() {
  const [isModalOpen, setModalOpen] = useState(true);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <div className={styles.modaloverlay} onClick={handleCloseModal}>
      <div className={styles.modalcontent }onClick={(e) => e.stopPropagation()}>
        <h2>Payment Successful</h2>
        <p>Thank you for shopping with Bikreta!</p>
        <button className={styles.closebutton }onClick={handleCloseModal}>Close</button>
      </div>
    </div>
  );
}

export default PaymentModal;
