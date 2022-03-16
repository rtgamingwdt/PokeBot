const ClientBase = require("./ClientBase");

module.exports =  class Event {

    constructor(name, once) {
        this.name = name;
        this.once = once;
    }

    getName() {
        return this.name;
    }

    isOnce() {
        return this.once;
    }

    async execute(...args) {
        console.error(`Missing "execute" method in event: ${this.name}`);
    }
}
