const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");

const {
  userSchema,
  companySchema,
  createUserList,
} = require("../validators/userValidator");
const { checkValidation } = require("../validators/validate");
const { checkEmailUnique } = require("../middleware/checkEmailUnique");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const upload = multer(); // no disk storage, just parse form-data without files

router.get("/users", userController.getUsers);

router.post(
  "/users",
  upload.none(),
  checkValidation(userSchema),
  checkEmailUnique,
  userController.createUser
); // parse multipart form-data

router.put("/users/:id", upload.none(), userController.updateUser);

router.delete("/users/:id", userController.deleteUser);

router.post(
  "/signup",
  upload.none(),
  checkValidation(userSchema),
  userController.handleUserSignUp
); // Sign-Up route

router.post("/login", upload.none(), userController.loginUser); // Login route

router.post(
  "/company",
  upload.none(),
  checkValidation(companySchema),
  userController.createCompany
); // parse multipart form-data

router.post(
  "/userlist",
  upload.none(),
  checkValidation(createUserList),
  authenticateToken,
  userController.createUserList
);

router.get("/userlist", authenticateToken, userController.getUserList);

module.exports = router;
