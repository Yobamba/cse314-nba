const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const validation = require("../validation");
const playersController = require("../controllers/nba_players.js");

// router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/register", (req, res) => {
  console.log("in the get register code");
  res.sendFile("register.html", { root: path.join(__dirname, "../public") });
});

router.post(
  "/register",
  validation.saveCreatedUser,
  playersController.createUser,
  (req, res) => {
    // res.sendFile("login.html", { root: path.join(__dirname, "../public") });
    res.sendFile("login", { root: path.join(__dirname, "../start_page") });
  }
);

router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: path.join(__dirname, "../public") });
  // res.redirect("login.html", { root: path.join(__dirname, "../public") });
});

router.post("/login", playersController.getUser, (req, res) => {});

module.exports = router;
