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
  createWorkDetailList,
  createCompanyList,
  createVendorList,
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

router.get("/userDetail", authenticateToken, userController.getUserDetail);

router.post("/login", upload.none(), userController.loginUser); // Login route

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

router.get("/employeeList", authenticateToken, userController.getEmployeeList);

router.post(
  "/workType",
  upload.none(),
  checkValidation(createWorkList),
  authenticateToken,
  checkIfIdExists("work_id", "employee"),
  checkUnique({ columnName: "worktype", tableName: "workType" }),
  userController.createWorkTypeList
);

router.get("/workType/:id", authenticateToken, userController.getWorkTypeById);

router.post(
  "/workDetail",
  upload.none(),
  checkValidation(createWorkDetailList),
  authenticateToken,
  checkIfIdExists("work_id", "workType"),
  userController.createWorkDetailList
);

router.get(
  "/workDetail/:id",
  authenticateToken,
  userController.getWorkDetailById
);

router.post(
  "/companyList",
  upload.none(),
  checkValidation(createCompanyList),
  authenticateToken,
  checkUnique({ columnName: "company_name", tableName: "company" }),
  checkUnique({ columnName: "emai", tableName: "company" }),
  userController.createCompanyList
);

router.get("/companyList", authenticateToken, userController.getCompanyList);

router.get(
  "/companyDetail/:id",
  authenticateToken,
  userController.getCompanyDetail
);

router.get(
  "/companyList/:required/:experience",
  authenticateToken,
  userController.getCompanySearch
);

router.post(
  "/vendorList",
  upload.none(),
  checkValidation(createVendorList),
  authenticateToken,
  checkUnique({ columnName: "email", tableName: "vendor" }),
  checkIfIdExists("company_id", "company"),
  userController.createVendorList
);

module.exports = router;
