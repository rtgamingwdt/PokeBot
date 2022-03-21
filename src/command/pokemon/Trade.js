const Command = require("../../base/Command");

const {
  SlashCommandBuilder
} = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow, MessageComponentInteraction, MessageSelectMenu } = require("discord.js");
const Database = require("../../base/Database");

module.exports = new (class Ping extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("trade")
        .setDescription("Trade pokemon with another trainer!")
        .addUserOption((option) =>
          option
            .setName("trainer")
            .setDescription("The trainer that you want to trade with!")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("pokemon")
            .setDescription("The pokemon you want to say goodbye to.")
            .setRequired(true)
        )
        .setDefaultPermission(true)
    );
  }

  async execute(client, interaction) {
    const embed = new MessageEmbed();
    let button;
    const pokemon1 = [];
    const pokemon2 = [];

    const trainer1 = await Database.getUserData(interaction.user.id);

    if (!trainer1) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Hey! You! Start Your Pokemon Journey Today!")
            .setDescription(
              "You cannot trade any pokemon until you have recieved your starter pokemon! You can get started by using the `start` command!"
            )
            .setColor("RED"),
        ],
      });
    }

    trainer1.pokemon.some((element) => {
      if (element.name == interaction.options.getString("pokemon")) {
        pokemon1.push(element.name);
      }
    });

    if (pokemon1.length == 0) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription(`You don't have the pokemon called ${interaction.options.getString("pokemon")}`)
            .setColor("RED")
        ]
      })
    }

    const trainer2 = await Database.getUserData(
      interaction.options.getUser("trainer").id
    );

    if (!trainer2) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Start Your Pokemon Journey Today")
            .setDescription(
              "You cannot trade with this trainer because they have not recieved their starter pokemon yet! They can get started by using the `start` command!"
            )
            .setColor("RED"),
        ],
      });
    }

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`${interaction.options.getUser("trainer").tag}, ${interaction.user.tag} wants to trade a ${interaction.options.getString("pokemon")} for one of your pokemon!`)
          .setColor("GREEN")
      ],
      components: [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("AcceptTrade")
            .setLabel("Accept")
            .setStyle("SUCCESS"),
          new MessageButton()
            .setCustomId("DeclineTrade")
            .setLabel("Decline")
            .setStyle("DANGER")
        ])
      ]
    }).then((msg) => {
      const filter = (i) =>
        (i.customId === "AcceptTrade" && i.user.id === interaction.options.getUser("trainer").id) ||
        (i.customId === "DeclineTrade" && i.user.id === interaction.options.getUser("trainer").id);

      const collector = interaction.channel.createMessageComponentCollector(
        { filter, time: 30000 }
      );

      const pokemonList = [];
      const pokemonToTrade = [];

      collector.on("collect", async (i) => {
        if (i.customId === "AcceptTrade" && i.user.id === interaction.options.getUser("trainer").id) {
          const data = await Database.getUserData(interaction.options.getUser("trainer").id);

          data.pokemon.forEach((pokemon) => {
            pokemonList.push({
              label: pokemon.name,
              description: pokemon.name,
              value: pokemon.name
            })
          });

          await interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setDescription(`${interaction.options.getUser("trainer").tag}, choose one of your pokemon from the dropdown!`)
                .setColor("GREEN")
            ],
            components: [
              new MessageActionRow().addComponents([
                new MessageSelectMenu()
                  .setCustomId('TradeSelection')
                  .setPlaceholder('No Pokemon Selected!')
                  .addOptions(pokemonList),
              ])
            ]
          });
        } else if (i.customId === "DeclineTrade" && i.user.id === interaction.options.getUser("trainer").id) {
          await interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setDescription("Declined Trade!")
                .setColor("RED")
            ],
            components: []
          });
          collector.stop();
        }
      });

      const filter2 = (i) =>
        (i.customId === "TradeSelection" && i.user.id === interaction.options.getUser("trainer").id);
      const collector2 = interaction.channel.createMessageComponentCollector(
        { filter2, time: 30000 }
      );

      collector2.on("collect", async (i) => {
        if (i.isSelectMenu()) {
          pokemonToTrade.push(`${interaction.options.getString("pokemon").toLowerCase()}`, `${i.values[0]}`);
          console.log(pokemonToTrade);
          await interaction.editReply(
            {
              embeds: [
                new MessageEmbed()
                  .setDescription(`${interaction.options.getUser("trainer")} is willing to trade a ${pokemonToTrade[1]} for your ${pokemonToTrade[0]}, do you accept the trade ${interaction.user.tag}?`)
                  .setColor("GREEN")
              ],
              components: [
                new MessageActionRow().addComponents([
                  new MessageButton()
                    .setCustomId("AcceptFinalTrade")
                    .setLabel("Accept")
                    .setStyle("SUCCESS"),
                  new MessageButton()
                    .setCustomId("DeclineFinalTrade")
                    .setLabel("Decline")
                    .setStyle("DANGER")
                ])
              ]
            })
        }
      });

      const filter3 = (i) =>
        (i.customId === "AcceptFinalTrade" && i.user.id === interaction.user.id) ||
        (i.customId === "DeclineFinalTrade" && i.user.id === interaction.user.id);
      const collector3 = interaction.channel.createMessageComponentCollector(
        { filter3, time: 15000 }
      );

      collector3.on("collect", async (i) => {
        if (i.customId === "AcceptFinalTrade" && i.user.id === interaction.user.id) {
          await Database.tradePokemon(interaction.user.id, interaction.options.getUser("trainer").id, pokemonToTrade[0], pokemonToTrade[1]).then(async () => {
            console.log(i);
            await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Trade Successful!")
                  .setDescription("Trade was successfully made!")
                  .setColor("GREEN")
              ],
              components: []
            }).then(() => {
              collector.stop();
              collector2.stop();
              collector3.stop();
            });
          })
        } else if (i.customId === "DeclineFinalTrade" && i.user.id === interaction.user.id) {
          await interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setTitle("Trade Failed")
                .setDescription("The trade was cancelled")
                .setColor("RED")
            ],
            components: []
          });
          collector.stop();
          collector2.stop();
          collector3.stop();
        }
      });
    });
  }
});
