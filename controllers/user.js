const User = require("../models/user");

exports.getRegister = async (req, res, next) => {
  res.render("register", { message: "", isLoggedin: false, name: "" });
};

exports.postRegister = async (req, res, next) => {
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
};

exports.getLogin = (req, res, next) => {
  res.render("login", { message: undefined, isLoggedin: false, name: "" });
};

exports.postLogin = async (req, res, next) => {
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
};

exports.getAddImages = (req, res, next) => {
  const user = req.user;
  res.render("addImage", {
    message: undefined,
    isLoggedin: true,
    name: user.name,
  });
};
exports.postAddImages = async (req, res, next) => {
  const user = req.user;
  const image = req.file.filename;
  const title = req.body.title;
  const { status, message } = await User.saveImage(user, image, title);
  if (status) {
    res.redirect("/get-images");
  } else {
    res.render("addImage", { message, isLoggedin: true, name: user.name });
  }
};
exports.getImages = async (req, res, next) => {
  const user = req.user;
  res.render("displayImages", {
    message: "",
    isLoggedin: true,
    name: user.name,
    images: user.images,
  });
};
exports.logout = (req, res, next) => {
  res.cookie("auth-token", "deleted");
  res.render("login", {
    message: undefined,
    isLoggedin: false,
    name: "",
  });
};
