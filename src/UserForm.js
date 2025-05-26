import React, { useState } from "react";
import axios from "axios";

const UserForm = ({
  fetchUsers,
  name,
  setName,
  email,
  setEmail,
  selectedId,
  setSelectedId,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const PostData = new FormData();
    PostData.append("name", name);
    PostData.append("email", email);
    PostData.append("address", "");
    PostData.append("password", "123456");

    const url = selectedId
      ? `http://192.168.1.73:5000/api/users/${selectedId}`
      : "http://192.168.1.73:5000/api/users";
    const method = selectedId
      ? axios.put(url, PostData)
      : axios.post(url, PostData);
    method
      .then((response) => {
        fetchUsers();

        if (response?.data?.code !== 200) alert(response?.data?.message);

        setSelectedId();
      })
      .catch((error) => {
        console.error("error+++", error);
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

      <button type="submit">
        {selectedId ? "Update Student" : "Add Student"}{" "}
      </button>
    </form>
  );
};

export default UserForm;
