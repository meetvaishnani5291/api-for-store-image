const express = require("express");

const userRoutes = require("./routes/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(userRoutes);

app.listen(3000);
