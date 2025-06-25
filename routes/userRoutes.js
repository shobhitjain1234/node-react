const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");

const {
  userSchema,
  createUserList,
  createEmployeeList,
  createWorkList,
  resetPassword,
  forgetPassword,
} = require("../validators/userValidator");
const { checkValidation } = require("../validators/validate");
const {
  checkUnique,
  checkContactUnique,
} = require("../middleware/checkUnique");
const { authenticateToken } = require("../middleware/auth");
const { checkIfIdExists } = require("../middleware/checkIfIdExists");

const router = express.Router();

const upload = multer(); // no disk storage, just parse form-data without files

router.post(
  "/signup",
  upload.none(),
  checkValidation(userSchema),
  checkUnique({ columnName: "address", tableName: "userLogin" }),
  userController.handleUserSignUp
); // Sign-Up route

router.post("/login", upload.none(), userController.loginUser); // Login route

router.post(
  "/userlist",
  upload.none(),
  checkValidation(createUserList),
  authenticateToken,
  userController.createUserList
);

router.get("/userlist", authenticateToken, userController.getUserList);

router.post(
  "/employeeList",
  upload.none(),
  checkValidation(createEmployeeList),
  authenticateToken,
  checkUnique({ columnName: "email", tableName: "employee" }),
  checkUnique({ columnName: "contact", tableName: "employee" }),
  // checkContactUnique,
  userController.createEmployeeList
);

router.post(
  "/workType",
  upload.none(),
  checkValidation(createWorkList),
  authenticateToken,
  checkIfIdExists("work_id", "employee"),
  checkUnique({ columnName: "worktype", tableName: "workType" }),
  userController.createWorkTypeList
);

router.post(
  "/forgot-password",
  upload.none(),
  checkValidation(forgetPassword),
  userController.forgotPassword
);

router.post(
  "/reset-password",
  upload.none(),
  checkValidation(resetPassword),
  userController.resetPassword
);

module.exports = router;
