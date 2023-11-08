const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const validation = require("../validation");
const port = process.env.PORT || 8080;
const User = require("../User");
router.use(bodyParser.json());

const playersController = require("../controllers/nba_players.js");

// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "views/register.html"));
// });

// Define the ensureAuthenticated middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("you're authenticated now!");
    return next(); // User is authenticated, proceed to the next middleware
  }

  res
    .status(401)
    .json({
      message:
        "Authentication required. In the browser url remove doc and replace it with start_page/register",
    });
};

router.get("/", ensureAuthenticated, playersController.getAll, () => {
  /**
   * #swagger.tags = ["NBA Players"]
   * #swagger.summary = "Get all of the players in the database"
   * #swagger.description = "Endpoint to get all of the players in the database"
   */
});

router.get("/:id", ensureAuthenticated, playersController.getSingle, () => {
  /**
   * #swagger.tags = ["NBA Players"]
   * #swagger.summary = "Get a single player from the database"
   * #swagger.description = "Endpoint to get a single contact from the database"
   */
});

router.post(
  "/",
  ensureAuthenticated,
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
  ensureAuthenticated,
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
  ensureAuthenticated,
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

router.delete(
  "/:id",
  ensureAuthenticated,
  playersController.deletePlayer,
  () => {
    /**
     * #swagger.tags = ["NBA Players"]
     * #swagger.summary = "Delete a player from the database"
     * #swagger.description = "Endpoint to delete a player from the database"
     */
  }
);

module.exports = router;
