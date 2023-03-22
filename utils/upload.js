const multer = require("multer");
const path = require("path");

const { ImageUploadError } = require("../utils/error");

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, path.join(__dirname, "..", "public", "images"));
  },
  filename: (req, file, next) => {
    next(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, next) => {
    if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      next(null, true);
    } else {
      return next(
        new ImageUploadError("Only .png, .jpg and .jpeg format allowed!"),
        false
      );
    }
  },
});

module.exports = upload;
