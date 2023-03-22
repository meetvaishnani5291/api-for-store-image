const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  ValidationError,
  AutenticationError,
  ImageUploadError,
} = require("../utils/error");

module.exports = async (req, res, next) => {
  const authToken = req.cookies["auth-token"];
  if (authToken === undefined) {
    next(new AutenticationError("please login!"));
  }
  const loggedUser = jwt.verify(authToken, "MY SECRET");
  if (loggedUser) {
    const user = await User.fetchUser(loggedUser);
    if (user) {
      req.user = user;
      next();
    } else {
      next(new AutenticationError("User not found!"));
    }
  } else {
    next(new AutenticationError("Session expired"));
  }
};
