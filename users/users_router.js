const express = require("express");
const bc = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constants = require("../config/constants");
const router = express.Router();
const Users = require("./users_model.js");
const e = require("express");

router.get("/", (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json({CurrentUsers: users})
    })
})

router.post("/register", (req, res) => {
    const newUser = req.body;
    
    if (newUser) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;

        const hash = bc.hashSync(newUser.password, rounds);
        newUser.password = hash;

        Users.add(newUser)
        .then(user => {
            res.status(200).json({user})
        })
        .catch(error => {
            res.status(500).json({error: error.message})
        })
    } else {
        res.status(401).json({
            message: "Please enter valid credentials!"
        })
    }
})

router.post("/login", (req, res) => {
    const {username, password} = req.body;

    if (req.body){
        Users.findBy({username: username})
        .then(([user]) => {
            if (user && bc.compareSync(password, user.password)) {
                const token = createToken(user)
                res.status(200).json({token, message: "Welcome", user})
            } else {
                res.status(401).json("Invalid Credentials")
            }
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
    } else {
        res.status(401).json("Please provide valid credentials to log-in!")
    }
    
})

function createToken(user) {
  
    const payload = {
      subject: user.id,
      username: user.username,
      department: user.department
    };
  
    const secret = constants.jwtSecret;
  
    const options = {
      expiresIn: "1d"
    };
    
    return jwt.sign(payload, secret, options)
  }

module.exports = router;