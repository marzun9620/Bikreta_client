import axios from "axios";
import { Link } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import image1 from "../electronics/electronic1.jpg";
import image2 from "../electronics/electronic2.jpg";
import styles from "./styles.module.css";
//... and so on
import BASE_URL from "../services/helper";
export const ProductItem = ({ product }) => {
  // Construct the URL to fetch the image from the backend
  const imageUrl = `${BASE_URL}/api/products/image/${product._id}`;

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
  const categoriesListRef = useRef(null);
  const [productss, setProductss] = useState([]);
  const [priceFilter, setPriceFilter] = useState(500);
  const [productDetails, setProductDetails] = useState([]);
  useEffect(() => {
    // Fetch products from all categories
    axios
      .get(`${BASE_URL}/product/api/products/all`)
      .then((response) => {
        console.log(response.data)
        setProductss(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    if (productss.length > 0) {
      const productDetailPromises = productss.map((product) => {
        return axios
          .get(`${BASE_URL}/product/api/discount-and-offer/${product._id}`)
          .then((response) => ({
            ...product,
            discount: response.data.discount,
            offer: response.data.offer,
          }))
          .catch((error) => {
            console.error("Error fetching discount and offer:", error);
          });
      });

      Promise.all(productDetailPromises)
        .then((details) => {
          setProductDetails(details);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
        });
    }
  }, [productss]);

  const handleScroll = (direction) => {
    const scrollDistance = 200; // Adjust the scroll distance as needed
    const container = categoriesListRef.current;

    if (container) {
      if (direction === "left") {
        container.scrollLeft -= scrollDistance;
      } else if (direction === "right") {
        container.scrollLeft += scrollDistance;
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products`);
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
    }, 2000); // Change slide every 5 seconds

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
      category: "Butter",
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

  const electronicsData1 = [
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic1.png`,
      name: "Oil",
      category: "oils",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic2.png`,
      name: "Chinigura Special",
      category: "polar-chal",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic3.png`,
      name: "Butter",
      category: "Butter",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic4.png`,
      name: "Coffee",
      category: "coffee",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic5.png`,
      name: "Corn Flex",
      category: "corn-flex",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic6.png`,
      name: "Coca-Cola",
      category: "Soft_Drinks",
    },
    {
      img: `${process.env.PUBLIC_URL}/images/electronics/electronic7.png`,
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
  // Example data structure
  // Example data structure
  const productData = [
    {
      name: "Oil",
      link: "/category/Oil",
      products: [
        {
          id: "652fdce37864660a02bf401c",
          name: "Teer Soyabin Oil",
          imageUrl: `${BASE_URL}/api/products/image/652fdce37864660a02bf401c`,
        },
        {
          id: "652fdd277864660a02bf401e",
          name: "Pran Soyabean Oil-2L",
          imageUrl: `${BASE_URL}/api/products/image/652fdd277864660a02bf401e`,
        },
        {
          id: "652fdd7b7864660a02bf4020",
          name: "Pran Mustard Oil 500g",
          imageUrl: `${BASE_URL}/api/products/image/652fdd7b7864660a02bf4020`,
        },
        {
          id: "652fdddd7864660a02bf4022",
          name: "Teer Soyabin Oil",
          imageUrl: `${BASE_URL}/api/products/image/652fdddd7864660a02bf4022`,
        },
      ],
    },
    {
      name: "Ata/Maida",
      link: "/category/Ata-Maida",
      products: [
        {
          id: "652fdf1a7864660a02bf4053",
          name: "Nabikl Ata 1Kg",
          imageUrl: `${BASE_URL}/api/products/image/652fdf1a7864660a02bf4053`,
        },
        {
          id: "652fdf9c7864660a02bf407f",
          name: "Sun shine Ata 1Kg",
          imageUrl: `${BASE_URL}/api/products/image/652fdf9c7864660a02bf407f`,
        },
        {
          id: "652fdfd07864660a02bf4081",
          name: "Teer Ata 1Kg",
          imageUrl: `${BASE_URL}/api/products/image/652fdfd07864660a02bf4081`,
        },
        {
          id: "652fe00d7864660a02bf4083",
          name: "Fresh Ata 1Kg",
          imageUrl: `${BASE_URL}/api/products/image/652fe00d7864660a02bf4083`,
        },
      ],
    },

    {
      name: "Soft Drinks",
      link: "/category/Drinks",
      products: [
        {
          id: "652fe0ea7864660a02bf4095",
          name: "Sprite 250mL",
          imageUrl: `${BASE_URL}/api/products/image/652fe0ea7864660a02bf4095`,
        },
        {
          id: "652fe1197864660a02bf4097",
          name: "Dew 500mL",
          imageUrl: `${BASE_URL}/api/products/image/652fe1197864660a02bf4097`,
        },
        {
          id: "652fe1447864660a02bf4099",
          name: "Cola 250mL",
          imageUrl: `${BASE_URL}/api/products/image/652fe1447864660a02bf4099`,
        },
        {
          id: "652fe1697864660a02bf409b",
          name: "Coca-Cola 30mL",
          imageUrl: `${BASE_URL}/api/products/image/652fe1697864660a02bf409b`,
        },
      ],
    },
  ];

  return (
    <div>
      <Header
        userName={localStorage.getItem("userName")}
        userId={localStorage.getItem("userId")}
      />

      <div className={styles.productListContainer}>
        <div className={styles.contentContainer}>
          <section className={styles.mainContent}>
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
            <h2>Items you would like</h2>

            <div className={styles.categoryBanner}>
              <div className={styles.categoriesList} ref={categoriesListRef}>
                <Link to="/category/Rice" className={styles.productLink}>
                  <div className={styles.categoryItem}>
                    <img
                      src={require("../electronics/electronic1.png")}
                      alt="Chaal"
                    />
                    <p>Rice/Chaal</p>
                    <div className={styles.dropdown}>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                    </div>
                  </div>
                </Link>
                <Link to="/category/Spicies" className={styles.productLink}>
                  <div className={styles.categoryItem}>
                    <img
                      src={require("../electronics/electronic3.png")}
                      alt="Daal"
                    />
                    <p>Cleaning</p>
                    <div className={styles.dropdown}>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                    </div>
                  </div>
                </Link>
                <Link to="/category/Spicies" className={styles.productLink}>
                  <div className={styles.categoryItem}>
                    <img
                      src={require("../electronics/electronic5.png")}
                      alt="Daal"
                    />
                    <p>Spicies</p>
                    <div className={styles.dropdown}>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                    </div>
                  </div>
                </Link>
                <Link to="/category/Spicies" className={styles.productLink}>
                  <div className={styles.categoryItem}>
                    <img
                      src={require("../electronics/electronic2.png")}
                      alt="Daal"
                    />
                    <p>Daal</p>
                    <div className={styles.dropdown}>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                    </div>
                  </div>
                </Link>
                <Link to="/category/Spicies" className={styles.productLink}>
                  <div className={styles.categoryItem}>
                    <img
                      src={require("../electronics/electronic5.png")}
                      alt="Daal"
                    />
                    <p>Spicies</p>
                    <div className={styles.dropdown}>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                    </div>
                  </div>
                </Link>
                <Link to="/category/Dairies" className={styles.productLink}>
                  <div className={styles.categoryItem}>
                    <img
                      src={require("../electronics/electronic6.png")}
                      alt="Daal"
                    />
                    <p>Dairies</p>
                    <div className={styles.dropdown}>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                    </div>
                  </div>
                </Link>
                {/* Add more category items here */}

                {/* ... (similarly for other category items) ... */}
                <Link to="/category/Dairies" className={styles.productLink}>
                  <div className={styles.categoryItem}>
                    <img
                      src={require("../electronics/electronic6.png")}
                      alt="Daal"
                    />
                    <p>Dairies</p>
                    <div className={styles.dropdown}>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                      <a href="#!">Top Sold</a>
                      <a href="#!">Curd</a>
                      <a href="#!">House no 1 choice</a>
                    </div>
                  </div>
                </Link>
              </div>
              <div
                className={styles.arrowLeft}
                onClick={() => handleScroll("left")}
              >
                ❮
              </div>
              <div
                className={styles.arrowRight}
                onClick={() => handleScroll("right")}
              >
                ❯
              </div>
            </div>

            {/* Display some products here */}

            <section className={styles.electronicsSection11}>
              <div className={styles.sectionContainer11}>
                <div className={styles.electronicsGrid11}>
                  {electronicsData.slice(0, 10).map((product, index) => (
                    <Link
                      key={index}
                      to={`/category/${product.category}`}
                      className={styles.productLink}
                    >
                      <div className={styles.productItem11}>
                        <img src={product.img} alt={product.name} />
                        <p>{product.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className={styles.singleImage}>
                  <img src={require("../electronics/rsz_veg.jpg")} alt="Daal" />
                </div>
              </div>
            </section>

            {/*--------------------------*/}
            <h2>Our Signature Items</h2>
            <div className={styles.productPanel}>
              {productDetails.length > 0 ? (
                productDetails
                  .filter((product) => product.unitPrice <= priceFilter)
                  .slice(0, productDetails.length) // Display the first 3 products
                  .map((filteredProduct) => (
                    <div
                      key={filteredProduct._id}
                      className={styles.productCard}
                    >
                      <Link
                        to={`/product/${filteredProduct._id}`}
                        className={styles.productLink}
                      >
                        <div className={styles.imageContainer}>
                          <img
                            src={`${BASE_URL}/api/products/image/${filteredProduct._id}`}
                            alt={filteredProduct.productName}
                            className={styles.productImage}
                          />
                        </div>
                        <h2 className={styles.productTitle}>
                          {filteredProduct.productName}
                        </h2>

                        <div className={styles.productPrice}>
                          <span
                            className={`${styles.actualPrice} ${
                              filteredProduct.discount === 0
                                ? styles.noDiscount
                                : ""
                            }`}
                          >
                            Price: ৳
                            <span className={styles.priceDigits}>
                              {filteredProduct.unitPrice}
                            </span>
                          </span>
                          {filteredProduct.discount !== 0 && (
                            <span className={styles.discountPrice}>
                              Price after discount: ৳
                              <span className={styles.priceDigitsBlack}>
                                {filteredProduct.unitPrice -
                                  (filteredProduct.unitPrice *
                                    filteredProduct.discount) /
                                    100}
                              </span>
                            </span>
                          )}
                        </div>

                        {filteredProduct.discount > 0 && (
                          <p className={styles.productDiscount}>
                            Discount: {filteredProduct.discount}%
                          </p>
                        )}

                        {filteredProduct.offer && (
                          <p className={styles.productOffer}>
                            Offer:{" "}
                            <span className={styles.offerDescription}>
                              {filteredProduct.offer}
                            </span>
                          </p>
                        )}
                        <div className={styles.productRating}>
                          {filteredProduct.averageRating > 0 ? (
                            <>
                              {filteredProduct.averageRating}
                              {Array.from({
                                length: Math.floor(
                                  filteredProduct.averageRating
                                ),
                              }).map((_, i) => (
                                <span key={i} className={styles.starSymbol}>
                                  &#9733;{" "}
                                </span>
                              ))}
                            </>
                          ) : (
                            "No one has rated yet"
                          )}
                        </div>
                      </Link>
                    </div>
                  ))
              ) : (
                <div className={styles.loadingIndicator}>
                  <div className={styles.loadingSpinner}></div>
                </div>
              )}
            </div>

            {/*---------------------------------------------------*/}

            <section className={styles.gridContainer}>
              {productData.map((column, colIdx) => (
                <div key={colIdx} className={styles.column}>
                  <h2 className={styles.columnHeadline}>
                    <Link to={column.link}>{column.name}</Link>
                  </h2>
                  <div className={styles.subColumn}>
                    {column.products.slice(0, 2).map((product, productIdx) => (
                      <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                        className={styles.productLink}
                      >
                        <div className={styles.cell}>
                          <img src={product.imageUrl} alt={product.name} />
                          <p>{product.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className={styles.subColumn}>
                    {column.products.slice(2, 4).map((product, productIdx) => (
                      <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                        className={styles.productLink}
                      >
                        <div className={styles.cell}>
                          <img src={product.imageUrl} alt={product.name} />
                          <p>{product.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className={styles.electronicsSection}>
              <h2>Others</h2>
              <div className={styles.horizontalScroll}>
                {electronicsData.map((product, index) => (
                  <div key={index} className={styles.horizontalItem}>
                    <img src={product.img} alt={product.name} />
                    <p>{product.name}</p>
                  </div>
                ))}
              </div>
            </section>
            {/*   <div className={styles.productGrid}>
              {currentProducts.slice(0, 5).map((product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>

            
            <div className={styles.productGrid}>
              {currentProducts.slice(5).map((product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
            */}
          </section>

          {/* More sections can be added similarly */}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default ProductList;
