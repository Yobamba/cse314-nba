const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const userSchema = {
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

module.exports = { User };
