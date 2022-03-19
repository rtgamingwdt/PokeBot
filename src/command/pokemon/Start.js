const Command = require("../../base/Command");

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const Database = require("../../base/Database");

module.exports = new (class Ping extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("start")
        .setDescription("Get started with PokeBot!")
        .setDefaultPermission(true)
    );
  }

  async execute(client, interaction) {
    const embed = new MessageEmbed();
    let button;
    let data = await Database.getUserData(interaction.user.id);

    if (!data) {
      interaction
        .reply({
          embeds: [
            embed.setTitle("Get Started").setDescription(`
                    Welcome to PokeBot! It is time for you to choose your own starter pokemon! If you would like to choose your own pokemon just click one of the 3 buttons below. Your options are:
                    \n  **Chespin:** Grass Type Pokemon
                    \n  **Fenekin:** Fire Type Pokemon
                    \n  **Froakie:** Water Type Pokemon
                `),
          ],
          components: [
            new MessageActionRow().addComponents([
              new MessageButton()
                .setCustomId("chespin")
                .setStyle("SUCCESS")
                .setLabel("Chespin"),
              new MessageButton()
                .setCustomId("fennekin")
                .setStyle("DANGER")
                .setLabel("Fennekin"),
              new MessageButton()
                .setCustomId("froakie")
                .setStyle("PRIMARY")
                .setLabel("Froakie"),
            ]),
          ],
        })
        .then((msg) => {
          const filter = (i) =>
            (i.customId === "chespin" && i.user.id === interaction.user.id) ||
            (i.customId === "fennekin" && i.user.id === interaction.user.id) ||
            (i.customId === "froakie" && i.user.id === interaction.user.id);
          let pokename;
          const collector = interaction.channel.createMessageComponentCollector(
            { filter, time: 10000 }
          );

          collector.on("collect", async (i) => {
            if (i.customId === "chespin") {
              await interaction.editReply({
                embeds: [new MessageEmbed().setTitle("Chespin")],
                components: [],
              });
              await Database.createUserData(interaction.user.id, "chespin");
              collector.stop();
            } else if (i.customId === "fennekin") {
              await interaction.editReply({
                embeds: [new MessageEmbed().setTitle("Fennekin")],
                components: [],
              });
              await Database.createUserData(interaction.user.id, "fennekin");
              collector.stop();
            } else if (i.customId === "froakie") {
              await interaction.editReply({
                embeds: [new MessageEmbed().setTitle("Froakie")],
                components: [],
              });
              await Database.createUserData(interaction.user.id, "froakie");
              collector.stop();
            }
          });
        });
    } else {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("CANNOT PERFORM ACTION")
            .setDescription("You already have a starter pokemon!")
            .setColor("RED"),
        ],
      });
    }
  }
})();
