const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");

const { userSchema, userSchema12 } = require("../validators/userValidator");
const { checkValidation } = require("../validators/validate");
const { checkEmailUnique } = require("../middleware/checkEmailUnique");

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

module.exports = router;
