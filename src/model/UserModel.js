const { model, Schema } = require("mongoose");

module.exports = model(
  "UserData",
  new Schema({
    UserID: String,
    pokemon: [Object],
    badges: [Object]
  })
);


// {
//   Founder: {
//     has: Boolean
//   },
//   Moderator: {
//     has: Boolean,
//   },
//   Indigo: {
//     has: Boolean,
//   },
//   Johto: {
//     has: Boolean,
//   },
//   Hoenn: {
//     has: Boolean,
//   },
//   Sinnoh: {
//     has: Boolean,
//   },
//   Unova: {
//     has: Boolean,
//   },
//   Kalos: {
//     has: Boolean,
//   },
//   Galar: {
//     has: Boolean,
//   },

// }