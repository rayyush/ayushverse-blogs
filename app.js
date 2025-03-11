const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");

const app = express();

const PORT = process.env.PORT || 9000;

require("dotenv").config();

app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB connected successfully"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve("./public")));
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log("User from authentication middleware:", req.user);
  res.locals.user = req.user || null;
  next();
});

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
    currentUrl: req.originalUrl,
  });
});

/*
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});
*/
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server started at ${process.env.PORT}`));
