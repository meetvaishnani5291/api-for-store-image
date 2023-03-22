const {
  ValidationError,
  AutenticationError,
  ImageUploadError,
} = require("../utils/error");

module.exports = (error, req, res, next) => {
  console.log(error);
  if (error instanceof AutenticationError) {
    res.render("login", {
      message: error.message,
      isLoggedin: false,
      name: "",
    });
  } else if (error instanceof ValidationError) {
    res.render("register", {
      message: error.message,
      isLoggedin: false,
      name: "",
    });
  } else if (error instanceof ImageUploadError) {
    console.log("start");
    return res.render("addImage", {
      message: error.message,
      isLoggedin: true,
      name: req.user.name,
    });
  } else {
    res.redirect("/logout");
  }
};
