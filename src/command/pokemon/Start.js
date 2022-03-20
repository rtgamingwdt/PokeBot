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
            embed.setTitle("Getting Started").setDescription(`
                    Welcome to **PokeBot**! It is time for you to choose your own **starter pokemon**! If you would like to choose your own pokemon just click one of the 3 buttons below. Your options are:
                    \n  <:Chespin:954865031571472394> **Chespin:** Grass Type Pokemon
                    \n  <:Fenekin:954865031290437752> **Fenekin:** Fire Type Pokemon
                    \n  <:Froakie:954865032209002526> **Froakie:** Water Type Pokemon
                `),
          ],
          components: [
            new MessageActionRow().addComponents([
              new MessageButton()
                .setCustomId("chespin")
                .setStyle("SUCCESS")
                .setLabel("Chespin")
                .setEmoji("954865031571472394"),
              new MessageButton()
                .setCustomId("fennekin")
                .setStyle("DANGER")
                .setLabel("Fennekin")
                .setEmoji("954865031290437752"),
              new MessageButton()
                .setCustomId("froakie")
                .setStyle("PRIMARY")
                .setLabel("Froakie")
                .setEmoji("954865032209002526"),
              new MessageButton()
                .setCustomId("Cancel")
                .setStyle("SECONDARY")
                .setLabel("Cancel")
                .setEmoji("❌")
            ]),
          ],
        })
        .then((msg) => {
          const filter = (i) =>
            (i.customId === "chespin" && i.user.id === interaction.user.id) ||
            (i.customId === "fennekin" && i.user.id === interaction.user.id) ||
            (i.customId === "froakie" && i.user.id === interaction.user.id) ||
            (i.customId == "Cancel") && i.user.id === interaction.user.id;
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
            } else if (i.customId === "Cancel") {
              await interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Canceled")
                    .setDescription("Your decision has been cancelled!")
                    .setColor("GREEN")
                ],
                components: []
              });
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
