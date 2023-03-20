const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports = (req, res, next) => {
  const authToken = req.cookies["auth-token"];
  if (authToken === "deleted") {
    res.render("login", { message: undefined, isLoggedin: false, name: "" });
  }
  const loggedUser = jwt.verify(authToken, "MY SECRET");

  if (loggedUser) {
    User.fetchUser(loggedUser).then((user) => {
      if (user) {
        req.user = user;
        console.log("ause authn");
        next();
      } else {
        res.render("login", {
          message: undefined,
          isLoggedin: false,
          name: "",
        });
      }
    });
  } else {
    res.render("login", { message: undefined, isLoggedin: false, name: "" });
  }
};
