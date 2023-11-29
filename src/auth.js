import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "./components/services/helper";

export const withAuth = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      const headers = token ? { "x-auth-token": token } : {};
      if (!token) {
        navigate("/admin/Login"); // Redirect to the login page
      } else {
        // Make an API call to your backend to verify the token
        axios
          .get(`${BASE_URL}/admin/api/verify-admin-token`, {
            headers
          })
          .then((response) => {
            if (response.status === 200) {
              setLoading(false);
              // Continue with rendering after setting loading to false
            } else {
              navigate("/admin/Login");
            }
          })
          .catch((error) => {
            console.error("Token verification failed:", error);
            navigate("/admin/Login");
          });
      }
    }, [navigate]);

    if (loading) {
      // You can return a loading indicator here if needed
      return <div>Loading...</div>;
    }

    // Render the component when the token is verified
    return <Component {...props} />;
  };
};
