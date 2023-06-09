const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const {
  ValidationError,
  AutenticationError,
  ImageUploadError,
} = require("../utils/error");

const userDataFile = path.join(__dirname, "../", "data", "users.json");

const getUsersFromFile = async () => {
  const fileContent = await fs.readFile(userDataFile);
  const users = JSON.parse(fileContent);
  return users;
};

const saveUsersToFile = async (users) => {
  const newFileContent = JSON.stringify(users);
  const result = await fs.writeFile(userDataFile, newFileContent);
};

const getHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

exports.register = async (newUser) => {
  newUser.password = await getHashedPassword(newUser.password);

  const users = await getUsersFromFile();
  if (users.some((user) => user.email === newUser.email)) {
    throw new ValidationError("User with this email already exist");
  } else {
    users.push({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      images: [],
    });
    await saveUsersToFile(users);
    return { status: true, message: "User added successfully." };
  }
};
exports.login = async (newUser) => {
  const users = await getUsersFromFile();

  const user = users.find((user) => user.email === newUser.email);
  if (user === undefined) {
    throw new AutenticationError("Invalid Email");
  }
  const validPass = await bcrypt.compare(newUser.password, user.password);
  if (!validPass) {
    throw new AutenticationError("Invalid Password");
  }
  const token = jwt.sign(user, "MY SECRET");
  return { status: true, token };
};
exports.saveImage = async (loggedUser, image, title) => {
  const users = await getUsersFromFile();

  const user = users.find((user) => user.email === loggedUser.email);
  user.images.push({ title, path: image });
  await saveUsersToFile(users);
  return { status: true, message: "Image uploaded successfully" };
};
exports.fetchUser = async (loggedUser) => {
  const users = await getUsersFromFile();

  return users.find((user) => user.email === loggedUser.email);
};
