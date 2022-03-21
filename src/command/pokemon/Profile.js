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
    let names;
    let badges;

    if (!user) user = interaction.user;

    const data = await Database.getUserData(user.id);

    if (!data) {
      embed.setTitle(`${user.tag}, is not a trainer yet`);
      embed.setDescription(`Use **/start** to start your journey as a pokèmon trainer!`);
      embed.setColor("YELLOW");
    } else {
      let badgeList = await Database.getBadges(user.id);
      const pokemonlist = data.pokemon.forEach((pokemon) => {
        nameList.push(
          pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        );
      });
      
      names = nameList.join("\n");
      badges = badgeList.join("\n") || "No Badges";
      
      embed.setTitle(`Trainer ${user.tag}'s Profile`);
      embed.addFields({
        name: "Pokemon", value: `${names}`
      }, {
        name: "Badges", value: `${badges}`
      })
    }
    interaction.reply({
      embeds: [embed],
    });
  }
})();
