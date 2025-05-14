import React, { useState } from "react";
import axios from "axios";

const UserForm = ({
  fetchUsers,
  name,
  setName,
  email,
  setEmail,
  age,
  setAge,
  address,
  setAddress,
  selectedId,
  setSelectedId,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const PostData = new FormData();
    PostData.append("name", name);
    PostData.append("email", email);
    PostData.append("age", age);
    PostData.append("address", address);

    const url = selectedId
      ? `http://192.168.1.71:5000/students/${selectedId}`
      : "http://192.168.1.71:5000/students";
    const method = selectedId
      ? axios.put(url, PostData)
      : axios.post(url, PostData);
    method
      .then((response) => {
        fetchUsers();

        setSelectedId();
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ margintop: "10px" }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <input
        type="text"
        placeholder="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button type="submit">
        {selectedId ? "Update Student" : "Add Student"}{" "}
      </button>
    </form>
  );
};

export default UserForm;
