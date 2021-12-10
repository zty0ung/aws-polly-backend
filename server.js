const express = require("express");
const cors = require("cors");
const fs = require("fs");
const AWS = require("aws-sdk");

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

const Polly = new AWS.Polly({
  region: "us-east-1",
});
const input = {
  Text: "John Douglas Russell, or J.D. for short, knows his way around a ranch. As a fifth-generation cattleman with Matador Cattle Company, he was practically born in the saddle. Even today, it's where he's most comfortable, relying on the instincts and abilities of his horse to manage 2,000 head of cattle over 10,000 acres in the Flint Hills, just outside Eureka, Kansas",
  OutputFormat: "mp3",
  VoiceId: "Joanna",
};
server.get("/", (req, res) => {
  res.status(200).send("API is working");
});
server.post("/", (req, res) => {
  // Polly.synthesizeSpeech(input, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   if (data.AudioStream instanceof Buffer) {
  //     fs.writeFile("hello.mp3", data.AudioStream, (fsErr) => {
  //       if (fsErr) {
  //         console.error(fsErr);
  //         return;
  //       }
  //       console.log("Success");
  //     });k
  //   }
  // });

  console.log(req.body);
  res.status(200).json(req.body);
});

module.exports = server;
