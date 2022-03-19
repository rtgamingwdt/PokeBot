const { model, Schema } = require("mongoose");

module.exports = model(
  "GuildData",
  new Schema({
    GuildID: String,
    channel: String,
    spawns: Boolean,
  })
);
