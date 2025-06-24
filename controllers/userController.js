const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const { generateJWT } = require("../utils/jwtUtils");

exports.handleUserSignUp = async (req, res) => {
  const { name, email, address, password } = req.body;

  // Check if email already exists
  userModel.findUserByEmailSign(email, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length > 0) return res.status(400).send("Email already in use");

    // Hash the password before saving to the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).send("Error encrypting password");

      const user = { name, email, address, password: hashedPassword };

      userModel.createUserSignup(user, (err, result) => {
        if (err) return res.status(500).send(err);

        const token = generateJWT({ id: result.insertId, email });

        res.json({
          message: "User created successfully",
          id: result.insertId,
          code: 200,
          token: token,
        });
      });
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  userModel.checkUserCredentials(email, password, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send("Invalid email or password");

    // Generate JWT token
    const token = generateJWT(user);

    res.json({ message: "Login successful", token: token });
  });
};

exports.createUserList = (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user.id; // From JWT token

  const item = { title, description, user_id };

  userModel.createUserList(item, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Item added", id: result.insertId });
  });
};

exports.getUserList = (req, res) => {
  const user_id = req.user.id;

  userModel.getUserListByUserId(user_id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};
