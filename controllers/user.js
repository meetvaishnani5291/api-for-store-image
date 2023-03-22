const { validationResult } = require("express-validator");

const User = require("../models/user");
const {
  ValidationError,
  AutenticationError,
  ImageUploadError,
} = require("../utils/error");

exports.getRegister = async (req, res, next) => {
  try {
    res.render("register", { message: "", isLoggedin: false, name: "" });
  } catch (error) {
    next(error);
  }
};

exports.postRegister = async (req, res, next) => {
  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      throw new ValidationError(validationError.errors[0].msg);
    }
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    const { status, message } = await User.register(user);
    if (status) {
      res.render("login", { message, isLoggedin: false, name: "" });
    } else {
      res.render("register", { message, isLoggedin: false, name: "" });
    }
  } catch (error) {
    next(error);
  }
};

exports.getLogin = (req, res, next) => {
  try {
    res.render("login", {
      message: undefined,
      isLoggedin: false,
      name: "",
    });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    const { status, message, token } = await User.login(user);
    if (status) {
      res.cookie("auth-token", token);
      res.redirect("/get-images");
    } else {
      res.render("login", { message, isLoggedin: false, name: "" });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAddImages = (req, res, next) => {
  try {
    const user = req.user;
    res.render("addImage", {
      message: undefined,
      isLoggedin: true,
      name: user.name,
    });
  } catch (error) {
    next(error);
  }
};
exports.postAddImages = async (req, res, next) => {
  try {
    const user = req.user;
    const image = req.file.filename;
    const title = req.body.title;
    const { status, message } = await User.saveImage(user, image, title);
    if (status) {
      res.redirect("/get-images");
    } else {
      res.render("addImage", { message, isLoggedin: true, name: user.name });
    }
  } catch (error) {
    next(error);
  }
};
exports.getImages = async (req, res, next) => {
  try {
    const user = req.user;
    res.render("displayImages", {
      message: "",
      isLoggedin: true,
      name: user.name,
      images: user.images,
    });
  } catch (error) {
    next(error);
  }
};
exports.logout = (req, res, next) => {
  try {
    res.clearCookie("auth-token");
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};
