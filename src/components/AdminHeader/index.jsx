import React, { useState } from "react";
import styles from './styles.module.css';

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <nav className={styles.navbar}>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={styles.menuBtn}>☰</button>

   
        <span className={styles.navbarBrand}>Bikreta Admin</span>

        <div className={styles.quickLinks}>
          <a href="#dashboard">Dashboard</a>
          <a href="#analytics">Analytics</a>
          <a href="#feedback">Feedback</a>
        </div>

        <div className={styles.searchContainer}>
          <input className={styles.searchInput} type="text" placeholder="Search..."/>
          <button className={styles.searchBtn}>🔍</button>
        </div>

        <div className={styles.navItems}>
          {/*
          <div className={styles.messageDropdown}>
            <button className={styles.messageBtn}>📩</button>
            <div className={styles.messageMenu}>
              <a href="#message1">Message 1</a>
              <a href="#message2">Message 2</a>
              <a href="#message3">Message 3</a>
            </div>
          </div>
  */}

          <div className={styles.userDropdown}>
            <span className={styles.userName}>John Doe</span>
            <div className={styles.userMenu}>
              <a href="#profile">Profile</a>
              <a href="#settings">Settings</a>
              <a href="#logout">Logout</a>
            </div>
          </div>

          <button className={styles.notificationBtn}>🔔</button>
        </div>

        <a href="#support" className={styles.supportLink}>Support</a>
      </nav>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={styles.closeBtn}>✕</button>
        {/* ... rest of sidebar content ... */}
      </div>
    </div>
  );
}

export default Header;
