const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path")

const postRoutes = require("./routes/posts")
const userRoutes = require("./routes/users")

const app = express();

mongoose.connect("mongodb+srv://Vishnu:" + process.env.MONGO_ATLAS_PWD + "@mydb-fwqpd.mongodb.net/node-posts")
  .then(() => {
    console.log("DataBase Connection Successfully")

  }).catch(() => {
    console.log("DataBase Connection Failed!")

  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backEnd/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use(postRoutes)
app.use("/api/user", userRoutes)

module.exports = app;
