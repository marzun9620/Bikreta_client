import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = "http://localhost:3000/api/auth";
      const { data: res } = await axios.post(url, data);

      localStorage.setItem("token", res.data);
      localStorage.setItem("userName", res.userName);
      localStorage.setItem("userId", res.userId);
      window.location = "/productlist";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false); // Ensure loading is set to false in case of both success and error
    }
  };

  return (
    <div>
      <Header />

      <div className={styles.login_container}>
        <div className={styles.login_form_container}>
          <div className={styles.left}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Login to Your Account</h1>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              {error && <div className={styles.error_msg}>{error}</div>}
              <button type="submit" className={styles.green_btn}>
                Sing In
              </button>
            </form>
            {loading && (
              <>
                <div className={styles.loaderBackground}></div>
                <div className={styles.loader}></div>
              </>
            )}{" "}
            {/* Loading spinner */}
          </div>
          <div className={styles.right}>
            <h1>New Here ?</h1>
            <Link to="/signup">
              <button type="button" className={styles.white_btn}>
                Sing Up
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
