import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";
import { Navigate,Link } from "react-router-dom";
import { Line } from "react-chartjs-2";

function PaymentModal() {
  const [isModalOpen, setModalOpen] = useState(true);
  const [pdfLink, setPdfLink] = useState("");

  const handleCloseModal = () => {
    setModalOpen(false);

    window.open("localhost:3006");
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
    const fullPDFLink = `http://localhost:3000${pdfLink}`;
    window.open(fullPDFLink, "_blank");
  };

  if (!isModalOpen) return null;

  return (
    <div className={styles.modaloverlay} onClick={handleCloseModal}>
      <div className={styles.modalcontent} onClick={(e) => e.stopPropagation()}>
        <h2>Payment Successful</h2>
        <p>Thank you for shopping with Bikreta!</p>
        {pdfLink && <button onClick={handleDownloadPDF}>Download PDF</button>}
        <Link to="/">
        <button className={styles.closebutton}>
          Close
        </button>
            </Link>
      
      </div>
    </div>
  );
}

export default PaymentModal;
