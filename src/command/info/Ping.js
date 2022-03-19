const Command = require("../../base/Command");

const {
  SlashCommandBuilder
} = require("@discordjs/builders");

module.exports = new class Ping extends Command {

  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("pong!")
        .setDefaultPermission(true)
    )
  }

  async execute(client, interaction) {
    interaction.reply("test");
  }
}
