const { model, Schema } = require('mongoose');

module.exports = model("UserData", new Schema({
    UserID: String,
    pokemon: [Object]
}));