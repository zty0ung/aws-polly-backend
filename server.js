const express = require("express");
const cors = require("cors");
// const axios = require("axios");
const server = express();
// const httpResponse = require('./httpResponseHelper');
server.use(
  cors({
    origin: "*",
  })
);
server.use(express.json());
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
server.get("/", (req, res) => {
  res.status(200).json("API is running");
});

module.exports = server;
