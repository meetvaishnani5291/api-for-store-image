class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
class AutenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AutenticationError";
  }
}
class ImageUploadError extends Error {
  constructor(message) {
    super(message);
    this.name = "ImageUploadError";
  }
}

module.exports = {
  ValidationError,
  AutenticationError,
  ImageUploadError,
};
