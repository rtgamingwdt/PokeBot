const Command = require("../../base/Command");

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Database = require("../../base/Database");

module.exports = new (class Ping extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("pokemon")
        .setDescription("pokemon")
        .setDefaultPermission(true)
    );
  }

  async execute(client, interaction) {
    const embed = new MessageEmbed();
    const { data } = await Database.getRandomPokemon();
    embed.setTitle(`${data.name}`);
    embed.addField("Base Experience", `${data.base_experience}`, true);
    embed.addField("Height", `${data.height}`, true);
    embed.addField("Weight", `${data.weight}`, true);
    embed.addField("Pokedex ID", `${data.id}`, true);
    embed.setThumbnail(`${data.sprites.front_default}`);

    data.stats.forEach((stats) => {
      embed.addField(stats.stat.name, `${stats.base_stat}`, true);
    });

    return interaction.reply({
      embeds: [embed],
    });
  }
})();
