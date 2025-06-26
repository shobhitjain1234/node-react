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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/signup",
  upload.single("image"), // changed from upload.none()
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

router.get("/userDetail", authenticateToken, userController.getUserDetail);

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
