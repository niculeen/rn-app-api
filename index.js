const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require("passport")
const dotenv = require("dotenv")
const multer = require('multer');

const LocalStrategy = require('passport-local').Strategy;


dotenv.config()

const routes = require("./app/routes");
const errorHandler = require("./app/middlewares/errorHandler");
const Role = mongoose.model("Role");
const uri = `${process.env.DB_PROTOCOL}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB}?retryWrites=true&w=majority`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

const app = express();
const User = mongoose.model("User");

app.use(multer().any())

app.use(cors());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(cookieParser());
app.use(require('express-session')({
  secret: process.env.AUTH_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());

app.use(passport.session());

passport.use("local", User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to privy application." });
});


app.use("/api", routes);


app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "gifter",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'gifter' to roles collection");
      });

      new Role({
        name: "cutie",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'cutie' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
