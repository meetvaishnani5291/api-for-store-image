const path = require("path");

const express = require("express");
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");

const autenticateUser = require("../middleware/auth");
const userController = require("../controllers/user");
const upload = require("../utils/upload");

const router = express.Router();

router.use(cookieParser());

router.use(express.static(path.join(__dirname, "..", "public")));

router.get("/register", userController.getRegister);

router.post("/register", userController.postRegister);

router.get("/login", userController.getLogin);

router.post("/login", userController.postLogin);

router.get("/add-image", autenticateUser, userController.getAddImages);

router.post(
  "/add-image",
  autenticateUser,
  upload.single("image"),
  userController.postAddImages
);

router.get("/get-images", autenticateUser, userController.getImages);

router.get("/logout", userController.logout);

module.exports = router;
