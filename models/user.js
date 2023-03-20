const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const util = require("util");
const userDataFile = path.join(__dirname, "../", "data", "users.json");

const readFilePromise = util.promisify(fs.readFile);

const getUsersFromFile = async (cb) => {
  const fileCont = await readFilePromise(userDataFile);
  // fs.readFile(userDataFile, (err, fileContent) => {
  //   if (err) {
  //     cb([]);
  //   } else {
  //     cb(JSON.parse(fileContent));
  //   }
  // });
};

const saveUsersToFile = (users) => {
  fs.writeFile(userDataFile, JSON.stringify(users), (err) => {
    console.log(err);
  });
};

const getHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

exports.register = async (newUser) => {
  newUser.password = await getHashedPassword(newUser.password);
  return new Promise(function (resolve, reject) {
    getUsersFromFile((users) => {
      if (users.some((user) => user.email === newUser.email)) {
        resolve({
          status: false,
          message: "User with this email already exists",
        });
      } else {
        users.push({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          images: [],
        });
        saveUsersToFile(users);
        resolve({ status: true, message: "User added successfully." });
      }
    });
  });
};
exports.login = async (newUser) => {
  return new Promise(function (resolve, reject) {
    getUsersFromFile(async (users) => {
      const user = users.find((user) => user.email === newUser.email);
      if (user === undefined) {
        resolve({ status: false, message: "User not found!" });
        return;
      }
      const validPass = await bcrypt.compare(newUser.password, user.password);
      if (!validPass) {
        resolve({ status: false, message: "Wrong password!" });
        return;
      }
      const token = jwt.sign(user, "MY SECRET");
      resolve({ status: true, token });
    });
  });
};
exports.saveImage = async (loggedUser, image, title) => {
  return new Promise(function (resolve, reject) {
    getUsersFromFile(async (users) => {
      const user = users.find((user) => user.email === loggedUser.email);
      user.images.push({ title, path: image });
      saveUsersToFile(users);
      resolve({ status: true, message: "Image uploaded successfully" });
    });
  });
};
exports.fetchUser = async (loggedUser) => {
  return new Promise(function (resolve, reject) {
    getUsersFromFile(async (users) => {
      const user = users.find((user) => user.email === loggedUser.email);
      resolve(user);
    });
  });
};
