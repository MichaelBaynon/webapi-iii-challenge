// code away!

const express = require("express");
const path = require('path')

const port = 8888;

const server = express();
server.use(express.json());

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get(
      "Origin"
    )} `
  );
  next();
}

function validateUserId(req, res, next) {
    const userid = req.params.id

    if(!userid || userid !== req.params.id) {
      return res.status(401).json({message: 'user id is not valid'})
    }
    
    next()
}

server.use(logger);

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
