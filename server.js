const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const express = require("express");
const swaggerDocument = require("./swagger-output.json");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const port = process.env.PORT || 8080;
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const findOrCreate = require("mongoose-findorcreate");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();
const mongoose = require("mongoose");
const User = require("./User.js");
const controller = require("./controllers/nba_players.js");
const ObjectId = require("mongodb").ObjectId;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// const User = new mongoose.model("User", userSchema);

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  session({
    secret: "Little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/", require("./routes"));

app.use(passport.initialize());
app.use(passport.session());

// Serialize the user to store in the session
passport.serializeUser((User, done) => {
  console.log("Serialize user: ", User);
  done(null, User.id); // Assuming you have an "id" field in your User model
});

// Deserialize the user from the session
passport.deserializeUser((id, done) => {
  console.log("Deserialize user: ", id);
  User.findById(id, (err, User) => {
    done(err, User);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://nba-sa92.onrender.com/auth/google/nba",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        console.log("profile: ", profile);
        return cb(err, user);
      });
    }
  )
);

app.get("/auth/google", (req, res) => {
  console.log("in the auth code");
  passport.authenticate("google", { scope: ["profile"] })(req, res);
});

app.get(
  "/auth/google/nba",
  passport.authenticate("google", {
    failureRedirect: "https://nba-sa92.onrender.com/start_page/login",
  }),
  function (req, res) {
    res.redirect("https://nba-sa92.onrender.com/doc");
    console.log("in the auth doc");
  }
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

module.exports = { passport };
