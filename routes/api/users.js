const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const uuid = require("uuid");
let users = require("../../Users.js");
const jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const mysql = require("mysql");
const req = require("express/lib/request");

//Create Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodemysql",
});
// connect to MySqL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL Connected ...");
});

// Create a Database
router.get("/creatDb", (req, res) => {
  let sql = "CREATE DATABASE nodemysql";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("Database Created.");
  });
});

//create table
router.get("/createemployee", (req, res) => {
  let sql =
    "CREATE TABLE employee (ID INT AUTO_INCREMENT, NAME VARCHAR (225), DESIGNATION VARCHAR (20),  AGE INT, ADDRESS CHAR (25), PRIMARY KEY (ID))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("Employee table Created...");
  });
});

//Insert Employee
router.get("/employee1", (req, res) => {
  let post = {
    NAME: "Muhammad wajih",
    DESIGNATION: "CEO",
    AGE: 27,
    ADDRESS: "House 25",
  };
  let sql = "INSERT INTO employee SET ?";
  db.query(sql, post, (err) => {
    if (err) {
      throw err;
    }
    res.send("Employee added");
  });
});

//Select Employee
router.get("/getemployee", (req, res) => {
  let sql = "select * from employee";
  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json({ Msg: "Fetched all Recordes", result });
  });
});

//update Employee
router.get("/updateemployee/:id", (req, res) => {
  newname = "ali";
  let sql =
    "UPDATE employee SET NAME = " + newname + "WHERE id = " + req.params.id;
  let query = db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("Record Updated");
  });
});

//Get all users Data
router.get("/", (req, res) => {
  res.json(users);
});

//Search Specific User on the basis of ID.
router.get("/:id", (req, res) => {
  const found = users.some((user) => user.id === parseInt(req.params.id));

  if (found) {
    res.json(users.filter((user) => user.id === parseInt(req.params.id)));
  } else {
    res.sendStatus(400);
  }
});

//create new user
router.post("/", (req, res) => {
  const newuser = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
  };

  if (!newuser.name || !newuser.email) {
    res.sendStatus(400);
  }
  users.push(newuser);
  res.json(users);
});
module.exports = router;

//Update new user
router.put("/:id", (req, res) => {
  const found = users.some((user) => user.id === parseInt(req.params.id));

  if (found) {
    const updateuser = req.body;
    users.forEach((user) => {
      if (user.id === parseInt(req.params.id)) {
        user.name = updateuser.name ? updateuser.name : user.name;
        user.email = updateuser.email ? updateuser.email : user.email;
        res.json({ msg: "user Updates", user });
      }
    });
  }
});

//Delete the user
router.delete("/:id", (req, res) => {
  const found = users.some((user) => user.id === parseInt(req.params.id));

  if (found) {
    users = users.filter((user) => user.id !== parseInt(req.params.id));
    res.json({ msg: "User Deleted", users });
  } else {
    res.sendStatus(400);
  }
});

//cretaing a JWT token and send to server.
router.post("/login", (req, res) => {
  const user = {
    id: 1,
    name: "Muhammad wajih",
    email: "wajih898@gmail.com",
  };
  jwt.sign({ user: user }, "secretkey", (err, token) => {
    res.json({
      token,
    });
  });
});

router.post("/post", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      console.log("error here");
      res.sendStatus(403); //forbidden
    } else {
      res.json({
        message: "Post Created ....",
        authData,
      });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(40); //forbidden
  }
}
