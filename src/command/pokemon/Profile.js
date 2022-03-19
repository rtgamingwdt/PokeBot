const Command = require("../../base/Command");

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Database = require("../../base/Database");

module.exports = new (class Ping extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("profile")
        .setDescription("See another trainers profile!")
        .addUserOption((option) =>
          option
            .setName("trainer")
            .setDescription("The other trainer you want to know about!")
        )
        .setDefaultPermission(true)
    );
  }

  async execute(client, interaction) {
    const embed = new MessageEmbed();
    const nameList = [];

    let user = interaction.options.getUser("trainer");
    let name;

    if (!user) user = interaction.user;

    const data = await Database.getUserData(user.id);

    if (!data) {
      embed.setTitle(`${user.tag}, isn't a valid trainer.`);
      embed.setDescription(`They have no pokemon!`);
      embed.setColor("YELLOW");
    } else {
      const pokemonlist = data.pokemon.forEach((pokemon) => {
        nameList.push(
          pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        );
        name = nameList.join("\n");
      });
      embed.setTitle(`Trainer ${user.tag}'s Profile`);
      embed.setDescription(name);
    }
    interaction.reply({
      embeds: [embed],
    });
  }
})();
