const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class Command {
  constructor(options = new SlashCommandBuilder()) {
    this.get = options;
  }

  async execute(client, interaction) {
    console.error(`Missing "execute" method in command: ${this.get.name}`);
  }
};
