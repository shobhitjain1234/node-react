import axios from "axios";
import "./App.css";
import UserForm from "./UserForm";
import { use, useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState();

  const [selectedId, setSelectedId] = useState();

  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        console.log("fetchUsers", response);

        setUsers(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:5000/user/${id}`)
      .then((response) => {
        console.log("User deleted:", response.data);
        // Refresh the user list after deletion
        fetchUsers();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };
  return (
    <div className="App">
      <h1>front end</h1>

      {users?.map((user) => (
        <li key={user.id} style={{ marginTop: "10px" }}>
          {user.name} ({user.email}) - {user.age} years{" "}
          <button
            onClick={() => deleteUser(user.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
          <button
            onClick={() => {
              setName(user.name);
              setEmail(user.email);
              setAge(user.age);
              setSelectedId(user.id);
            }}
            style={{ marginLeft: "10px" }}
          >
            Update
          </button>
        </li>
      ))}

      <UserForm
        fetchUsers={fetchUsers}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        age={age}
        setAge={setAge}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </div>
  );
}

export default App;
