import axios from "axios";
import "./App.css";
import UserForm from "./UserForm";
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("demo");
  const [email, setEmail] = useState("demo@gmail.com");

  const [selectedId, setSelectedId] = useState();

  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios
      .get("http://192.168.1.71:5000/api/users")
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
      .delete(`http://192.168.1.71:5000/api/users/${id}`)
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
        <li key={user?.id} style={{ marginTop: "10px" }}>
          {user?.id} {user?.name} {user?.email}
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
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </div>
  );
}

export default App;
