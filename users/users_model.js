const db = require("../connections.js");

module.exports = {
    find,
    add,
    findBy
}

function find() {
    return db("users").select("username", "password", "department");
}

function findBy(filter) {
    return db("users").where(filter).orderBy("id");
}

function add(body) {
    return db("users").insert(body);
}

function findById(id) {
    return db("users").where({ id }).first();
  }