const secret = process.env.AUTH_SECRET

const mongoose = require("mongoose");
const User = mongoose.model("User"); // db.user;
const Role = mongoose.model("Role"); //db.role;
const message = require("../config/message.config")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { generateOTP } = require("../services/otp")
const { sendMail } = require("../services/mail")
const upload = require('../services/upload');

exports.signup = (req, res) => {
  console.log(req.body)
  let otp = generateOTP();
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    // password: bcrypt.hashSync(req.body.password, 8),
    roleId: req.body.role,
    dob: new Date(req.body.dob),
    wishlist: req.body.wishlist,
    avatar: null,
    otp
  });
  if (req.body.role) {
    Role.findOne(
      {
        name: { $in: req.body.role },
      },
      async (err, role) => {
        if (err) {
          res.status(500).send({ message: message.error.db, message: err });
          return;
        }

        user.roleId = role._id;
        try {
          let data = await upload(req);
          user.avatar = data.url
        } catch (err) {
          console.log("No avatar file", err)
          // return res.status(400).send({message:message.error.noavatar})
        }
        User.register(user, req.body.password, function (err, account) {
          if (err) {
            return res.status(500).send({ message: message.error.db, err });
          }

          /* passport.authenticate('local')(req, res, function () {
            res.redirect('/');
          }); */
          return res.status(201).send({ message: message.auth.signup });

        });

        /* user.save((err) => {
          if (err) {
            return res.status(500).send({ message: message.error.db, err });
          }

          // sendMail({ otp }).then(result => {
          // return res.status(201).send({ message: message.auth.signup });
          // })
        }); */
      }
    );
  } /* else {
    Role.findOne({ name: "user" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (role) {

        user.roleId = role._id;
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          sendMail({ otp }).then(result => {
            res.send({ message: "User was registered successfully!" });
          });
        })
      }

    });
  } */
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("role", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: message.error.db, err, error: "database" });
        return;
      }

      if (!user) {
        error: "password"
        return res.status(404).send({ message: message.error._404, error: "email" });
      }

    /*   var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: message.error._401,
          error: "password"
        });
      } */

     /*  var token = jwt.sign({ id: user._id, email: user.email }, secret, {
        expiresIn: 86400, // 24 hours
      }); */
      res.status(200).send({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        wishlist: user.wishlist,
        role: user.role,
        // accessToken: token,
      });
    });
};

exports.verify = (req, res) => {
  res.send("")
}

exports.otp = (req, res) => {
  res.send("")
}