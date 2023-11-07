const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const validation = require("../validation");
const port = process.env.PORT || 8080;
const User = require("../User");
const temporary = require("../server.js");
router.use(bodyParser.json());

const playersController = require("../controllers/nba_players.js");

// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "views/register.html"));
// });

router.get("/", playersController.getAll, () => {
  /**
   * #swagger.tags = ["NBA Players"]
   * #swagger.summary = "Get all of the players in the database"
   * #swagger.description = "Endpoint to get all of the players in the database"
   */
  console.log("req: ", req);
});

router.get("/:id", playersController.getSingle, () => {
  /**
   * #swagger.tags = ["NBA Players"]
   * #swagger.summary = "Get a single player from the database"
   * #swagger.description = "Endpoint to get a single contact from the database"
   */
});

router.post(
  "/",
  validation.saveCreatedPlayer,
  playersController.createPlayer,
  () => {
    /**
     * #swagger.tags = ["NBA Players"]
     * #swagger.summary = "Create a new player"
     * #swagger.description = "Endpoint to create a new player"
     * #swagger.parameter['obj'] => {
     * in: 'body',
     * type: 'object',
     * description: 'Player data'}
     */
  }
);

router.post(
  "/user",
  validation.saveCreatedUser,
  playersController.createUser,
  () => {
    /**
     * #swagger.tags = ["NBA Players"]
     * #swagger.summary = "Create a new user"
     * #swagger.description = "Endpoint to create a new user"
     * #swagger.parameter['obj'] => {
     * in: 'body',
     * type: 'object',
     * description: 'Player data'}
     */
  }
);

router.put(
  "/:id",
  validation.saveModifiedPlayer,
  playersController.modifyPlayer,
  () => {
    /**
     * #swagger.tags = ["NBA Players"]
     * #swagger.summary = "Modify a player"
     * #swagger.description = "Endpoint to get a single player from the database and modify it"
     */
  }
);

router.delete("/:id", playersController.deletePlayer, () => {
  /**
   * #swagger.tags = ["NBA Players"]
   * #swagger.summary = "Delete a player from the database"
   * #swagger.description = "Endpoint to delete a player from the database"
   */
});

module.exports = router;
