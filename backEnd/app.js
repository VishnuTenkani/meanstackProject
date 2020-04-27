const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path")

const postRoutes = require("./routes/posts")

const app = express();

mongoose.connect("mongodb+srv://Vishnu:VK6IUduF4NLcFezJ@mydb-fwqpd.mongodb.net/node-posts?retryWrites=true&w=majority")
.then(()=>{
    console.log("DataBase Connection Successfully")
    
}).catch(()=>{
    console.log("DataBase Connection Failed!")
    
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backEnd/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use(postRoutes)

module.exports = app;
