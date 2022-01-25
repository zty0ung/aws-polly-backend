const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
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
    LexiconNames: ["Koch"],
    Engine: "neural",
  };
  Polly.synthesizeSpeech(input, (err, data) => {
    if (err) {
      console.log(err.message);
      res.status(200).json(err);
    } else if (data) {
      let s3params = {
        Body: data.AudioStream,
        Bucket: "kochnewsaudio",
        Key: `${req.body.title}.mp3`,
      };
      const s3 = new AWS.S3();
      s3.upload(s3params, function (err, data) {
        if (err) {
          console.log(err.message);
          res.status(500).json(data);
        } else {
          console.log(data.Location);
          res.status(200).json(data);
        }
      });
    }
  });

  console.log(req.body);
});

server.post("/azure", (req, res) => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_KEY,
    process.env.AZURE_REGION
  );
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;
  speechConfig.speechSynthesisVoiceName = "en-US-SaraNeural";
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, undefined);
  synthesizer.speakTextAsync(
    req.body.transcript,
    (result) => {
      // Interact with the audio ArrayBuffer data

      let s3params = {
        Body: Buffer.from(result.privAudioData),
        Bucket: "kochnewsaudio",
        Key: `${req.body.title}.mp3`,
      };
      const s3 = new AWS.S3();
      s3.upload(s3params, function (err, data) {
        if (err) {
          console.log(err.message);
          res.status(500).json(data);
        } else {
          console.log(data.Location);
          res.status(200).json(data);
        }
      });
      synthesizer.close();
    },
    (error) => {
      console.log(error);
      synthesizer.close();
    }
  );

  console.log(req.body);
});
module.exports = server;
