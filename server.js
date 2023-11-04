const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const express = require("express");
const swaggerDocument = require("./swagger-output.json");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const port = process.env.PORT || 8080;
const session = require("session");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const findOrCreate = require("mongoose-findorcreate");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/", require("./routes"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/nba",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.use(cors);
// an event listener for uncaught exceptions
process.on("uncaughtException", (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000 for api documentation");
});
