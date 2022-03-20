const Command = require("../../base/Command");

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    TextChannel,
} = require("discord.js");
const Database = require("../../base/Database");

module.exports = new (class Admin extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("admin")
                .setDescription("Admin command for the pokebot owners!")
                .addSubcommand((option) =>
                    option
                        .setName("give-badge")
                        .setDescription("Set a channel for pokemon to spawn at!")
                        .addUserOption((option) =>
                            option
                                .setName("trainer")
                                .setDescription("The trainer to give the badge to")
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("badge")
                                .setDescription("The bade you want to give")
                                .addChoices([
                                    ["Founder", "Founder"],
                                    ["Moderator", "Moderator"],
                                    ["Indigo", "Indigo"],
                                    ["Johnto", "Johnto"],
                                    ["Hoenn", "Hoenn"],
                                    ["Sinnoh", "Sinnoh"],
                                    ["Unova", "Unova"],
                                    ["Kalos", "Kalos"],
                                    ["Galar", "Galar"]
                                ]).setRequired(true)
                        )
                )
                .addSubcommand((option) =>
                    option
                        .setName("remove-user-data")
                        .setDescription("Remove user data")
                        .addUserOption((option) => option.setName("trainer").setDescription("The trainer you want to remove data from").setRequired(true)))
        )
    }

    async execute(client, interaction) {
        if (interaction.member.roles.cache.some(role => role.id === "953072595434078228")) {
            if (interaction.options.getSubcommand() == "give-badge") {
                await Database.giveBadge(interaction.options.getUser("trainer").id, interaction.options.getString("badge")).then(() => {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Gave the **${interaction.options.getString("badge")}** Badge to ${interaction.options.getUser("trainer").tag}`)
                                .setColor("GREEN")
                        ]
                    })
                })
            }

            if (interaction.options.getSubcommand() == "remove-user-data") {
                await Database.deleteUserData(interaction.options.getUser("trainer").id).then(() => {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`${interaction.options.getUser("trainer").tag}'s Data has been erased!`)
                                .setColor("GREEN")
                        ]
                    })
                })
            }
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Missing Permission")
                        .setDescription("You do not have permission to use this.")
                        .setColor("RED")
                ]
            })
        }
    }
})();
