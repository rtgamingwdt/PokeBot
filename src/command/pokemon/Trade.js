const Command = require("../../base/Command");

const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow, MessageComponentInteraction } = require("discord.js");
const Database = require("../../base/Database");

module.exports = new class Ping extends Command {

    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("trade")
                .setDescription("Get started with PokeBot!")
                .addUserOption((option) => option.setName("trainer").setDescription("The trainer that you want to trade with!").setRequired(true))
                .addStringOption((option) => option.setName("pokemon").setDescription("The pokemon you want to say goodbye to.").setRequired(true))
                .setDefaultPermission(true)
        )
    }

    async execute(client, interaction) {
        const embed = new MessageEmbed();
        let button;
        const pokemon1 = [];
        const pokemon2 = [];

        if(interaction.options.getUser("trainer").id == interaction.user.id) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle("I don't understand")
                .setDescription("You cannot trade with yourself")
                .setColor("RED")
            ]
        });

        const trainer1 = await Database.getUserData(interaction.user.id);

        if (!trainer1) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Start Your Pokemon Journey Today!")
                        .setDescription("You cannot trade any pokemon until you have recieved your starter pokemon! You can get started by using the `start` command!")
                        .setColor("RED")
                ]
            });
        }

        trainer1.pokemon.some((element) => {
             if(element.name == interaction.options.getString("pokemon")) {
                 pokemon1.push(element.name);
             }
         });

         if(pokemon1.length == 0) {
             return interaction.reply({
                 embeds: [
                     new MessageEmbed()
                     .setDescription(`You don't have the pokemon called ${interaction.options.getString('pokemon')}`)
                     .setColor("RED")
                 ]
             })
         }

        const trainer2 = await Database.getUserData(interaction.options.getUser("trainer").id);

        if (!trainer2) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Start Your Pokemon Journey Today")
                        .setDescription("You cannot trade with this trainer because they have not recieved their starter pokemon yet! They can get started by using the `start` command!")
                        .setColor("RED")
                ]
            });
        }

        // await Database.tradePokemon(trainer1.UserID, trainer2.UserID, "camerupt-mega", "swampert-mega")

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${interaction.user.tag}, wants to trade with ${interaction.options.getUser("trainer").tag}`)
                .setColor("YELLOW")
            ],
            comonents: [
                new MessageActionRow()
                .addComponents([
                    new MessageButton()
                    .setCustomId("ACCEPT_TRADE")
                    .setLabel("Accept")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("DECLINE_TRADE")
                    .setLabel("Decline")
                    .setStyle("DANGER")
                ])
            ]
        })
    }
}
