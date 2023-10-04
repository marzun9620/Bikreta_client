import axios from "axios";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import image1 from "../electronics/electronic1.jpg";
import image2 from "../electronics/electronic2.jpg";
import styles from "./styles.module.css";
//... and so on

export const ProductItem = ({ product }) => {
  // Construct the URL to fetch the image from the backend
  const imageUrl = `http://localhost:3000/api/products/image/${product._id}`;

  return (
    <Link to={`/product/${product._id}`} className={styles.productLink}>
      <div className={styles.productCard}>
        <img
          src={imageUrl}
          alt={product.name}
          className={styles.productImage}
        />
        <h2 className={styles.productName}>{product.name}</h2>
        <span className={styles.productCategory}>{product.category}</span>
        <p className={styles.productDescription}>{product.description}</p>
        <span className={styles.productPrice}>Price: ${product.price}</span>
        <button className={styles.buyBtn}>Buy Now</button>
      </div>
    </Link>
  );
};

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Adjust the number of products per page
  const [sortByRating, setSortByRating] = useState(false);
  const [showDiscounted, setShowDiscounted] = useState(false);
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/products");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    {
      image: `${process.env.PUBLIC_URL}/images/banner/banner-2.jpg`,
      altText: "Description of Image 1",
    },
    {
      image: `${process.env.PUBLIC_URL}/images/banner/banner-1.jpg`,
      altText: "Description of Image 1",
    },
    {
      image: `${process.env.PUBLIC_URL}/images/banner/banner-3.jpg`,
      altText: "Description of Image 1",
    },
    {
      image: `${process.env.PUBLIC_URL}/images/banner/banner-4.jpg`,
      altText: "Description of Image 1",
    },
    // ... Add more banners as needed
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 3000); // Change slide every 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    // Filter by selected category
    let filteredProducts = products;
    if (selectedCategory) {
      filteredProducts = products.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by price (low to high)
    filteredProducts.sort((a, b) => a.price - b.price);

    setSortedProducts(filteredProducts);

    if (showDiscounted) {
      filteredProducts = filteredProducts.filter((product) => product.discount);
    }

    // Sort by rating (if selected)
    if (sortByRating) {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    setSortedProducts(filteredProducts);
  }, [products, selectedCategory, searchTerm, showDiscounted, sortByRating]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFavoriteToggle = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const Sidebar = {
    handleCategoryChange,
    setSortByRating,
    setShowDiscounted,
    sortByRating,
    showDiscounted,
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    return (
      <div className={styles.pagination}>
        <button
          onClick={() =>
            setCurrentPage((prevPage) => (prevPage === 1 ? 1 : prevPage - 1))
          }
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage === totalPages ? totalPages : prevPage + 1
            )
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };
  const electronicsData = [
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic7.jpg`,
      name: "Oil",
      category: "oils",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic8.jpg`,
      name: "Chinigura Special",
      category: "polar-chal",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic3.jpg`,
      name: "Butter",
      category: "butter",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic4.jpg`,
      name: "Coffee",
      category: "coffee",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic5.jpg`,
      name: "Corn Flex",
      category: "corn-flex",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic6.jpg`,
      name: "Coca-Cola",
      category: "Soft_Drinks",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic1.jpg`,
      name: "Chips",
      category: "chips",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic2.jpg`,
      name: "Tomato Sauce",
      category: "sauce",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic9.jpg`,
      name: "Full Cream Milk",
      category: "milk",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic10.jpg`,
      name: "Biscuits",
      category: "biscuits",
    },
    // ... so on
  ];
  function getCellImage(colIdx, rowIdx, cellIdx) {
    // Just a sample logic, you can adjust as per your requirements

    if (colIdx === 0 && rowIdx === 0 && cellIdx === 0) return image1;
    if (colIdx === 0 && rowIdx === 0 && cellIdx === 1) return image2;
    if (colIdx === 0 && rowIdx === 1 && cellIdx === 0) return image2;
    if (colIdx === 0 && rowIdx === 1 && cellIdx === 1) return image2;

    if (colIdx === 1 && rowIdx === 0 && cellIdx === 0) return image2;
    if (colIdx === 1 && rowIdx === 0 && cellIdx === 1) return image2;
    if (colIdx === 1 && rowIdx === 1 && cellIdx === 0) return image2;
    if (colIdx === 1 && rowIdx === 1 && cellIdx === 1) return image2;

    if (colIdx === 2 && rowIdx === 0 && cellIdx === 0) return image2;
    if (colIdx === 2 && rowIdx === 0 && cellIdx === 1) return image2;
    if (colIdx === 2 && rowIdx === 1 && cellIdx === 0) return image2;
    if (colIdx === 2 && rowIdx === 1 && cellIdx === 1) return image2;

    // ... and so on for all your images
  }

  return (
    <div>
      <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
      />
      <div className={styles.productListContainer}>
        <div className={styles.contentContainer}>
          <section className={styles.mainContent}>
            <div className={styles.categoryBanner}>
              <h2>Featured Categories</h2>
              <div className={styles.categoriesList}>
                <div className={styles.categoryItem}>
                  <img src={image1} alt="Electronics" />
                  <p>Electronics</p>
                  <div className={styles.dropdown}>
                    <a href="#!">Mobiles</a>
                    <a href="#!">Laptops</a>
                    <a href="#!">Cameras</a>
                  </div>
                </div>
                <div className={styles.categoryItem}>
                  <img src={image1} alt="Books" />
                  <p>Books</p>
                  <div className={styles.dropdown}>
                    <a href="#!">Fiction</a>
                    <a href="#!">Non-Fiction</a>
                    <a href="#!">Sci-Fi</a>
                  </div>
                </div>
                <div className={styles.categoryItem}>
                  <img src={image1} alt="Electronics" />
                  <p>Electronics</p>
                  <div className={styles.dropdown}>
                    <a href="#!">Mobiles</a>
                    <a href="#!">Laptops</a>
                    <a href="#!">Cameras</a>
                  </div>
                </div>
                <div className={styles.categoryItem}>
                  <img src={image1} alt="Electronics" />
                  <p>Electronics</p>
                  <div className={styles.dropdown}>
                    <a href="#!">Mobiles</a>
                    <a href="#!">Laptops</a>
                    <a href="#!">Cameras</a>
                  </div>
                </div>
                <div className={styles.categoryItem}>
                  <img src={image1} alt="Electronics" />
                  <p>Electronics</p>
                  <div className={styles.dropdown}>
                    <a href="#!">Mobiles</a>
                    <a href="#!">Laptops</a>
                    <a href="#!">Cameras</a>
                  </div>
                </div>
                {/* ... Continue similarly for other categories */}
              </div>
            </div>

            {/* Display some products here */}
            <div className={styles.promoBanner}>
              {banners.map((banner, index) => (
                <div
                  className={`${styles.bannerSlide} ${
                    currentSlide === index ? styles.activeSlide : ""
                  }`}
                  key={index}
                >
                  <img src={banner.image} alt={banner.altText} />
                </div>
              ))}

              <div className={styles.paginationDots}>
                {banners.map((_, index) => (
                  <div
                    className={`${styles.dot} ${
                      currentSlide === index ? styles.activeDot : ""
                    }`}
                    key={index}
                    onClick={() => setCurrentSlide(index)} // Optional: click a dot to navigate to that slide
                  ></div>
                ))}
              </div>
            </div>

            <section className={styles.electronicsSection}>
              <h2>Best of Grocery</h2>
                
              <div className={styles.horizontalScroll}>
            

                {electronicsData.map((product, index) => (
                  <Link
                  
                    key={index}
                    to={`/category/${product.category}`}
                    className={styles.productLink}
                  >
                    <div className={styles.horizontalItem}>
                      <img src={product.img} alt={product.name} />
                      <p>{product.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className={styles.electronicsSection}>
              <h2>Electronics</h2>
              <div className={styles.horizontalScroll}>
                {electronicsData.map((product, index) => (
                  <div key={index} className={styles.horizontalItem1}>
                    <img src={product.img} alt={product.name} />
                    <p>{product.name}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.gridContainer}>
              {Array.from({ length: 3 }).map((_, colIdx) => (
                <div key={colIdx} className={styles.column}>
                  <h2 className={styles.columnHeadline}>
                    <a href="/path-to-category">Category Name {colIdx + 1}</a>
                  </h2>
                  {Array.from({ length: 2 }).map((_, rowIdx) => (
                    <div key={rowIdx} className={styles.row}>
                      {Array.from({ length: 2 }).map((_, cellIdx) => (
                        <div key={cellIdx} className={styles.cell}>
                          <img
                            src={getCellImage(colIdx, rowIdx, cellIdx)}
                            alt="Product"
                          />
                          <p>Product Name</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </section>
            <section className={styles.electronicsSection}>
              <h2>Electronics</h2>
              <div className={styles.horizontalScroll}>
                {electronicsData.map((product, index) => (
                  <div key={index} className={styles.horizontalItem}>
                    <img src={product.img} alt={product.name} />
                    <p>{product.name}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className={styles.productGrid}>
              {currentProducts.slice(0, 5).map((product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>

            {/* Display more products */}
            <div className={styles.productGrid}>
              {currentProducts.slice(5).map((product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
          </section>
        </div>

        {renderPagination()}
      </div>
      <Footer />
    </div>
  );
};
export default ProductList;
