const Command = require("../../base/Command");

const { SlashCommandBuilder } = require("@discordjs/builders");
const Utility = require("../../base/Utility");

module.exports = new class Slap extends Command {

    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("slap")
                .setDescription("Slap someone")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user you want to slap")
                        .setRequired(true)
                )
                .setDefaultPermission(true)
        )
    }

    async execute(client, interaction) {
        const user1 = interaction.user;
        const user2 = interaction.options.getUser("user");

        const attachment = await Utility.slap(interaction, user1, user2);

        interaction.reply({
            files: [
                attachment
            ]
        })
    }
}