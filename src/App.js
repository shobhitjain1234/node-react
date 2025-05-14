import axios from "axios";
import "./App.css";
import UserForm from "./UserForm";
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("aman");
  const [email, setEmail] = useState("aman@gmail.com");
  const [age, setAge] = useState(25);

  const [address, setAddress] = useState("Indore");

  const [selectedId, setSelectedId] = useState();

  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios
      .get("http://192.168.1.71:5000/students")
      .then((response) => {
        console.log("fetchUsers", response);

        setUsers(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const fetchSingleUser = () => {
    axios
      .get("http://192.168.1.71:5000/students/18")
      .then((response) => {
        console.log("fetchUsers", response);

        console.log("+++", response?.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchSingleUser();
  }, []);

  const deleteUser = (id) => {
    axios
      .delete(`http://192.168.1.71:5000/students/${id}`)
      .then((response) => {
        console.log("User deleted:", response.data);
        // Refresh the user list after deletion
        fetchUsers();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleUpdateEmail = (e) => {
    e.preventDefault();

    const PostData = new FormData();

    PostData.append("email", "patchl@gmail.com");
    PostData.append("address", "path city");

    const url = `http://192.168.1.71:5000/students/18`;
    const method = axios.patch(url, PostData);
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
  };

  return (
    <div className="App">
      <h1>front end</h1>

      <button type="button" onClick={handleUpdateEmail}>
        patch
      </button>

      {users?.map((user) => (
        <li key={user?.id} style={{ marginTop: "10px" }}>
          {user?.name} ({user?.email}) - {user?.age} - {user?.address} years{" "}
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
        address={address}
        setAddress={setAddress}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </div>
  );
}

export default App;
