// const serverless = require('serverless-http');
require("dotenv").config();
const server = require("./server.js");

const port = process.env.PORT || 6000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
// module.exports.handler = serverless(server);
