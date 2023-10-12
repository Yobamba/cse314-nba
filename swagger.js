const swaggerAutogen = require("swagger-autogen")();
//
const doc = {
  info: {
    title: "Players API",
    description: "API that handles a database of players",
  },
  host: "localhost:3000",
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./server.js");
});
