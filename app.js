const express = require("express");
const path = require("path");

const userRoutes = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(userRoutes);
app.use(errorHandler);

app.listen(4000);
