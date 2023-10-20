const { response } = require("express");
const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection("nba_players").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const getSingle = async (req, res, next) => {
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

const modifyPlayer = async (req, res, next) => {
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
  modifyPlayer,
  deletePlayer,
};
