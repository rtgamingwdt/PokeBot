const Command = require("../../base/Command");

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
    const embed = new MessageEmbed()
    .setTitle("PING")
    .setDescription("PONG!");
    
    interaction.reply({
      embeds: [
        embed   
      ]
    })
  }
}
