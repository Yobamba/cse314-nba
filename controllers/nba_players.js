const path = require("path");
const { response } = require("express");
const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;
const passport = require("passport");
const cors = require("cors");
const user = require("../User.js");

// const getAll = async (req, res, next) => {
//   console.log("req: ", req.user);
//   // if (req.isAuthenticated()) {
//   try {
//     const result = await mongodb.getDb().db().collection("nba_players").find();
//     result.toArray().then((lists) => {
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).json(lists);
//     });
//   } catch (err) {
//     res.status(400).json({ message: err });
//   }
//   // } else {
//   //   console.log("Please log in. ");
//   // }
// };

const getAll = async (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    if (err) {
      console.log(err);
      return next(err); // Handle error
    }
    if (!user) {
      console.log("user: ", user);
      return res.status(401).json({ message: "Authentication failed" });
    }

    // User is authenticated, proceed with the route logic
    try {
      const result = await mongodb
        .getDb()
        .db()
        .collection("nba_players")
        .find();
      result.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists);
      });
    } catch (err) {
      res.status(400).json({ message: err });
    }
  })(req, res, next);
};

// const getAll = async (req, res, next) => {
//   passport.authenticate("google", async (err, user, info) => {
//     if (err) {
//       console.log(err);
//       return next(err); // Handle error
//     }
//     if (!user) {
//       console.log("user: ", user);
//       return res.status(401).json({ message: "Authentication failed" });
//     }

//     // User is authenticated, proceed with the route logic
//     try {
//       const result = await mongodb
//         .getDb()
//         .db()
//         .collection("nba_players")
//         .find();
//       result.toArray().then((lists) => {
//         res.setHeader("Content-Type", "application/json");
//         res.status(200).json(lists);
//       });
//     } catch (err) {
//       res.status(400).json({ message: err });
//     }
//   })(req, res, next);
// };

const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to find a player.");
  }
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("nba_players")
      .find({ _id: userId });
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  } catch {
    if (err) {
      res.status(400).json({ message: err });
    }
  }
};

const createPlayer = async (req, res) => {
  const player = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    jerseyNumber: req.body.jerseyNumber,
    position: req.body.position,
    age: req.body.age,
    height: req.body.height,
    team: req.body.team,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("nba_players")
    .insertOne(player);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while creating the contact."
      );
  }
};

const createUser = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("users")
    .insertOne(user);
  if (response.acknowledged) {
    res.redirect("http://localhost:3000/start_page/login");
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while creating the user.");
    console.log("Erro!");
  }
};

const getUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await mongodb
      .getDb()
      .db()
      .collection("users")
      .findOne({ email });

    if (!user) {
      // User not found
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // const passwordMatch = await compare(password, user.password);

    if (password == user.password) {
      // Passwords match - You can create a session or issue a JWT token for authentication here
      // For session-based authentication, you might use a library like express-session
      // For token-based authentication, you might use a library like jsonwebtoken (JWT)

      // Example using JWT:
      // const jwtToken = generateJwtToken(user);
      console.log("the password is a match. ");
      res.redirect("http://localhost:3000/doc");

      // Return the JWT token to the client
      // return res.status(200).json({ token: jwtToken });
    } else {
      // Passwords don't match
      console.log("Passwords don't match");
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An error occurred" });
  }
};

const modifyPlayer = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to find a player.");
  }
  const player = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    jerseyNumber: req.body.jerseyNumber,
    position: req.body.position,
    age: req.body.age,
    height: req.body.height,
    team: req.body.team,
  };
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("nba_players")
    .replaceOne({ _id: userId }, player);
  if (response.acknowledged) {
    res.status(204).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while updating the player.");
  }
};

const deletePlayer = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to delete a player.");
  }
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("nba_players")
    .deleteOne({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while deleting the player.");
  }
};

module.exports = {
  getAll,
  getSingle,
  createPlayer,
  createUser,
  getUser,
  modifyPlayer,
  deletePlayer,
};
