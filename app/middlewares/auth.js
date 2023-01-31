const jwt = require("jsonwebtoken");
const msg = require("../config/message.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;
const secret = process.env.AUTH_SECRET

verifyToken = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ message: msg.error._401 });
  }
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ message: msg.error._403 });
  }
  token = token.replace("Bearer ", "")

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: msg.error._401 });
    }
    req.user = { id: decoded.id, email: decoded.email }
    next();
  });
};

isGifter = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: msg.error.db, err });
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "gifter") {
            next();
            return;
          }
        }

        return res.status(403).send({ message: "Require Gifter Role!" });
      }
    );
  });
};

isCutie = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: msg.error.db, err });
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          return res.status(500).send({ message: msg.error.db, err });
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "cutie") {
            next();
            return;
          }
        }

        return res.status(403).send({ message: msg.error._403 });
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isGifter,
  isCutie
};
module.exports = authJwt;
