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

server.get("/", (req, res) => {
  res.status(200).send("API is working");
});
server.post("/", (req, res) => {
  const input = {
    Text: req.body.transcript,
    OutputFormat: "mp3",
    VoiceId: "Joanna",
  };
  Polly.synthesizeSpeech(input, (err, data) => {
    if (err) {
      console.log(err.message);
    } else if (data) {
      let s3params = {
        Body: data.AudioStream,
        Bucket: "kochnewsaudio",
        Key: "news2.mp3",
      };
      const s3 = new AWS.S3();
      s3.upload(s3params, function (err, data) {
        if (err) {
          console.log(err.message);
        } else {
          console.log(data.Location);
        }
      });
    }
  });

  console.log(req.body);
  res.status(200).json(req.body);
});

module.exports = server;
