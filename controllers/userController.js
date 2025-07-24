const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { generateJWT } = require("../utils/jwtUtils");

exports.handleUserSignUp = async (req, res) => {
  const { name, email, address, password } = req.body;
  const image = req.file ? req.file.filename : null;

  userModel.findUserByEmailSign(email, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length > 0) return res.status(400).send("Email already in use");

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).send("Error encrypting password");

      const user = {
        name,
        email,
        address,
        password: hashedPassword,
        image,
      };

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

exports.getEmployeeList = (req, res) => {
  const user_id = req.user.id;

  userModel.getEmployeeListByUserId(user_id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getUserDetail = (req, res) => {
  const user_id = req.user.id;

  userModel.getUserUserId(user_id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createEmployeeList = (req, res) => {
  const { name, address, contact, email } = req.body;
  const user_id = req.user.id; // From JWT token

  const item = { name, address, contact, email, user_id };

  userModel.createEmployeeList(item, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "employee added", id: result.insertId });
  });
};

exports.createWorkTypeList = (req, res) => {
  const { worktype, payroll, work_id } = req.body;

  const item = { worktype, payroll, work_id };

  userModel.createWorkTypeList(item, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "work added", id: result.insertId });
  });
};

exports.getWorkTypeById = (req, res) => {
  const { id } = req.params; // work_id

  userModel.getWorkTypeById(id, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0)
      return res.status(404).send("No work types found for this work_id");

    res.json(results); // returns an array of matching workType rows
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  userModel.findUserByEmailSign(email, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("Email not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    userModel.storeResetOtp(email, otp, expires, (err) => {
      if (err) return res.status(500).send(err);

      // Send email
      const transporter = nodemailer.createTransport({
        service: process.env.SERVICE_PROVIDER,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Your OTP for Password Reset",
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).send("Failed to send OTP email");
        res.send("OTP sent to your email");
      });
    });
  });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  userModel.verifyResetOtp(email, otp, async (err, isValid) => {
    if (err) return res.status(500).send(err);
    if (!isValid) return res.status(400).send("Invalid or expired OTP");

    const hashed = await bcrypt.hash(newPassword, 10);

    userModel.updatePassword(email, hashed, (err) => {
      if (err) return res.status(500).send(err);
      res.send("Password reset successfully");
    });
  });
};

exports.createWorkDetailList = (req, res) => {
  const { payroll, hrs, work_id } = req.body;

  const item = { payroll, hrs, work_id };

  userModel.createWorkDetailList(item, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "work detail added", id: result.insertId });
  });
};

exports.getWorkDetailById = (req, res) => {
  const { id } = req.params; // work_id

  userModel.getWorkDetailById(id, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0)
      return res.status(404).send("No work types found for this work_id");

    res.json(results); // returns an array of matching workType rows
  });
};

exports.createCompanyList = (req, res) => {
  const {
    company_name,
    emai,
    address,
    domain,
    is_experience_required,
    total_experience_in_years,
  } = req.body;

  const company_id = req.user.id; // From JWT token

  const item = {
    company_name,
    emai,
    address,
    domain,
    is_experience_required,
    total_experience_in_years,
    company_id,
  };

  userModel.createCompanyList(item, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "company added", id: result.insertId, code: 200 });
  });
};

exports.getCompanyList = (req, res) => {
  const company_id = req.user.id;

  userModel.getCompanyList(company_id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getCompanyDetail = (req, res) => {
  const { id } = req.params; // work_id

  userModel.getCompanyDetail(id, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0)
      return res.status(404).send("No detail found for this work_id");

    res.json(results[0]); // returns an array of matching workType rows
  });
};

exports.getCompanySearch = (req, res) => {
  const { required, experience } = req.params; // work_id

  userModel.getCompanySearch(required, experience, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0)
      return res.status(404).send("No detail found for this work_id");

    res.json(results); // returns an array of matching workType rows
  });
};

exports.createVendorList = (req, res) => {
  const { name, email, total_experience_in_years, company_id } = req.body;

  const item = {
    name,
    email,
    total_experience_in_years,
    company_id,
  };

  userModel.createVendorList(item, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "vendor added", id: result.insertId, code: 200 });
  });
};

exports.getVendorListByCompany = (req, res) => {
  const { company_id } = req.params;

  userModel.getVendorsByCompany(company_id, (err, vendors) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ vendors });
  });
};

exports.getVendorListWithCompany = (req, res) => {
  userModel.getVendorListWithCompany((err, vendors) => {
    if (err) {
      return res.status(500).json({ error: "Database join error" });
    }
    res.status(200).json({ vendors });
  });
};

exports.createProductList = (req, res) => {
  const { name, price, type } = req.body;
  const user_id = req.user.id; // From JWT token

  const item = { name, price, type, user_id };

  userModel.createProductList(item, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "product added", id: result.insertId });
  });
};

exports.getProductList = (req, res) => {
  const user_id = req.user.id;
  const searchText = req.query.search || ""; // Get search from query param
  const priceText = req.query.price || ""; // Get price from query param

  userModel.getProductListByUserId(
    user_id,
    searchText,
    priceText,
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
};

exports.getProductTypeTotal = (req, res) => {
  const user_id = req.user.id;

  userModel.getProductTypeTotalByUserId(user_id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};
