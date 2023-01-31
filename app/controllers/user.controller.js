const mongoose = require("mongoose")
const User = mongoose.model("User")
const upload = require("../services/upload")
const msg = require("../config/message.config")
exports.allAccess = (req, res) => {
  res.status(200).send(req.user);
};

exports.updateAvatar = async (req, res) => {
  User.findById(req.user.id).then(async user => {
    let data = await upload(req)
    user.set("avatar", data.url);
    user.save().then(result => {
      res.status(200).send(data)
    }).catch(err => res.status(500).send({}))
  })
}

exports.updateProfile = (req, res) => {
  User.findById(req.user.id).then(user => {
    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        const value = req.body[key];
        user.set(key, value)
      }
    }
    user.save().then(result => {
      return res.status(200).send({ message: msg.success._200, data: req.body })
    })
  }).catch(err => {
    return res.status(500).send({ message: msg.success._200, data: result })
  })
  // res.status(200).send("Admin Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
