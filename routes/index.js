const routes = require("express").Router();
const controllers = require("../controllers/nba_players");
const swaggerDocument = require("../swagger-output.json");
const swaggerUi = require("swagger-ui-express");
// const swagger = require("../swagger.js");

routes.use("/nba_players", require("./nba_players"));

routes.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes.listen(3000, () => {
//   console.log("listening for documentation on port 3000");
// });

module.exports = routes;
