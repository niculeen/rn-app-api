module.exports = function plugin(schema, options) {
  schema.set("timestamps", true);
  schema.set("toObject", {
    virtuals: true
  });
  schema.set("toJSON", {
    virtuals: true
  }
  );
};
