const ClientBase = require("./base/ClientBase");
const Website = require("./base/Website");

const client = new ClientBase();
const website = new Website();

client.build();
website.build();

module.exports.client = client;
module.exports.website = website;