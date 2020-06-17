const express = require("express");
const server = express();

const usersRouter = require("./users/users_router.js")

server.use(express.json());

server.use("/api/users", usersRouter);


module.exports = server;