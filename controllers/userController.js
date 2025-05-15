const userModel = require("../models/userModel");

exports.getUsers = (req, res) => {
  userModel.getAllUsers((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  const { name, email, address } = req.body;

  const user = { name, email, address };

  userModel.createUser(user, (err, result) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "User created", id: result.insertId });
  });
};

exports.updateUser = (req, res) => {
  const { name, email } = req.body;
  const user = { name, email };
  const id = req.params.id;
  userModel.updateUser(id, user, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User updated" });
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  userModel.deleteUser(id, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User deleted" });
  });
};
