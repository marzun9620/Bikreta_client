import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../services/helper";
import "./UserList.css"; // Import your CSS file

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch the list of users from your API
    axios
      .get(`${BASE_URL}/admin/api/allusers`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.districts.toLowerCase().includes(search.toLowerCase()) ||
      user.shopName.toLowerCase().includes(search.toLowerCase()) ||
      user._id.slice(-3).includes(search)
  );

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">All Users</h2>
      <input
        type="text"
        placeholder="Search by name,Shop name district, or last 3 digits of ID"
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Shop Name</th>
            <th>Email</th>
            <th>Districts</th>
            <th>Thana</th>
            <th>House No</th>
            <th>Product History</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.fullName}</td>
              <td>{user.shopName}</td>
              <td>{user.email}</td>
              <td>{user.districts}</td>
              <td>{user.thana}</td>
              <td>{user.houseNo}</td>
              <td>
                <Link
                  to={`/user/${user._id}/product-history/${user._id}`}
                  className="product-history-link"
                >
                  Product History
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
