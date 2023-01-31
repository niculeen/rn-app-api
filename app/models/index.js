const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.plugin(require('./plugin'));
const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["admin", "cutie", "gifter"];

module.exports = db;