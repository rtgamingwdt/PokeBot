const Command = require("../../base/Command");

const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
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

        trainer1.pokemon.some((element) => {
            if(element.name == interaction.options.getString("pokemon")) {
                console.log(true);
            }
        });

        await Database.tradePokemon(trainer1.UserID, trainer2.UserID, "camerupt-mega", "swampert-mega")
    }
}
