const ClientBase = require("../ClientBase");
const Event = require("../base/Event");

module.exports = new class Ready extends Event {

    constructor() {
        super("ready", true);
    }

    async execute(client) {
        console.log(`${client.user.tag}, is online!`);
    }
}
