import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './styles.module.css';
import Header from '../Header';
import Footer from '../Footer';



const CategoryPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      axios.get(`http://localhost:3000/api/products/category/${category}`)
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error("Error fetching products:", error);
        });
    }, [category]);
  
    return (
      <>
        <Header />
  
        <div className={styles.container}>
          <div className={styles.filterPanel}>
            {/* Add filter options here */}
          </div>
          <div className={styles.productPanel}>
            {products.map(product => (
              <div key={product._id} className={styles.productCard}>
                <img src={`data:${product.productImage.contentType};base64,${product.productImage.data.toString('base64')}`} alt={product.name} />
                <h2>{product.name}</h2>
                <span>Price: ${product.price}</span>
                <p>{product.description}</p>
              </div>
            ))}
          </div>
        </div>
  
        <Footer />
      </>
    );
  }
  
  export default CategoryPage;
  