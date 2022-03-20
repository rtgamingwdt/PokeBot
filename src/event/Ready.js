const { createCanvas, loadImage } = require("canvas");
const Database = require("../base/Database");
const Event = require("../base/Event");
const chalk = require("chalk");

module.exports = new (class Ready extends Event {
  constructor() {
    super("ready", true);
  }

  async execute(client) {
    const statusList = [
      {
        type: "WATCHING",
        name: "Ash"
      },
      {
        type: "PLAYING",
        name: "Pokemon"
      }
    ]
    console.log(chalk.green(`${client.user.tag}, is online!`));

    client.user.setActivity(statusList[0]);

    setInterval(() => {
      const index = Math.floor(Math.random() * ((statusList.length - 1) - 0 + 1) + 0);
      const status = statusList[index];
      client.user.setActivity(status);
    }, 30000)
  }
})();
