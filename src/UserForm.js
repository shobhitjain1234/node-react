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
  selectedId,
  setSelectedId,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { name, email, age };

    const url = selectedId
      ? `http://localhost:5000/user/${selectedId}`
      : "http://localhost:5000/user";
    const method = selectedId
      ? axios.put(url, newUser)
      : axios.post(url, newUser);
    method
      .then((response) => {
        fetchUsers();
        setName("");
        setEmail("");
        setAge();
        setSelectedId();
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });

    // if (selectedId) {
    //   axios
    //     .put(url, newUser)
    //     .then((response) => {
    //       fetchUsers();
    //       setName("");
    //       setEmail("");
    //       setAge();
    //       setSelectedId();
    //     })
    //     .catch((error) => {
    //       console.error("Error adding user:", error);
    //     });
    // } else {
    //   axios
    //     .post(url, newUser)
    //     .then((response) => {
    //       fetchUsers();
    //       setName("");
    //       setEmail("");
    //       setAge();
    //       setSelectedId();
    //     })
    //     .catch((error) => {
    //       console.error("Error adding user:", error);
    //     });
    // }
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
        type="email"
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
      <button type="submit">{selectedId ? "Update User" : "Add User"} </button>
    </form>
  );
};

export default UserForm;
