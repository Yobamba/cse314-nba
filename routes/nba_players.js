const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const port = process.env.PORT || 8080;

router.use(bodyParser.json());

const playersController = require("../controllers/nba_players.js");

router.get("/", playersController.getAll, () => {
  /**
   * #swagger.tags = ["NBA Players"]
   * #swagger.summary = "Get all of the players in the database"
   * #swagger.description = "Endpoint to get all of the players in the database"
   */
});

router.get("/:id", playersController.getSingle, () => {
  /**
   * #swagger.summary = "Get a single player from the database"
   * #swagger.description = "Endpoint to get a single contact from the database"
   */
});

router.post("/", playersController.createPlayer, () => {
  /**
   * #swagger.summary = "Create a new player"
   * #swagger.description = "Endpoint to create a new player"
   * #swagger.parameter['obj'] => {
   * in: 'body',
   * type: 'object',
   * description: 'Player data'}
   */
});

router.put("/:id", playersController.modifyPlayer, () => {
  /**
   * #swagger.summary = "Modify a player"
   * #swagger.description = "Endpoint to get a single player from the database and modify it"
   */
});

router.delete("/:id", playersController.deletePlayer, () => {
  /**
   * #swagger.summary = "Delete a player from the database"
   * #swagger.description = "Endpoint to delete a player from the database"
   */
});

module.exports = router;
