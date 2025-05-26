const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
  userModel.getAllUsers((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};   

exports.createUser = async (req, res) => {
  const { name, email, address, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = { name, email, address, password: hashedPassword };

  userModel.createUser(user, (err, result) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "User created", id: result.insertId, code: 200 });
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

exports.createCompany = async (req, res) => {
  const { name, address } = req.body;

  const user = { name, address };

  userModel.createCompany(user, (err, result) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "company created", id: result.insertId, code: 200 });
  });
};
