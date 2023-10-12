const routes = require("express").Router();
const controllers = require("../controllers/nba_players");
const swaggerDocument = require("../swagger-output.json");
const swaggerUi = require("swagger-ui-express");

routes.use("/nba_players", require("./nba_players"));

routes.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = routes;
