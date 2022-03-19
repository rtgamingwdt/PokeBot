const Command = require("../../base/Command");

const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow, TextChannel } = require("discord.js");
const Database = require("../../base/Database");

module.exports = new class Ping extends Command {

    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("pokespawns")
                .setDescription("Get started with PokeBot!")
                .addSubcommand((option) => option.setName("set-channel").setDescription("Set a channel for pokemon to spawn at!").addChannelOption((option) => option.setName("location").setDescription("Set the location for pokemon to spawn at!")))
                .addSubcommand((option) => option.setName("set").setDescription("Enable/Disable Pokespawns").addBooleanOption((option) => option.setName("enabled").setDescription("Disable or Enable Pokespawns").setRequired(true)))
                .setDefaultPermission(true)
        )
    }

    async execute(client, interaction) {

        if (interaction.options.getSubcommand() == "set-channel") {
            if (interaction.member.permissions.has("MANAGE_CHANNELS")) {
                let channel = interaction.options.getChannel("location");

                if (!channel) channel = interaction.channel;

                if (channel.type !== "GUILD_TEXT") return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Please select a text channel.")
                            .setColor("RED")
                    ]
                });

                await Database.setPokespawnChannel(interaction.guild.id, channel.id).then(() => {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`SUCCESS!`)
                                .setDescription(`Pokemon will now spawn at ${channel.name}`)
                                .setColor("YELLOW")
                        ]
                    });
                });
            } else {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Missing Permission")
                            .setDescription("You do not have permission to manage channels.")
                            .setColor("RED")
                    ]
                });
            }
        }

        if (interaction.options.getSubcommand() == "set") {
            if (interaction.member.permissions.has("MANAGE_CHANNELS")) {
                const guildData = await Database.getGuildData(interaction.guild.id);
                if (guildData.channel) {
                    await Database.togglePokespawns(interaction.guild.id, interaction.options.getBoolean("enabled")).then(() => {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`Pokespawns`)
                                    .setDescription(`Pokespawns have been set to ${interaction.options.getBoolean("enabled")} in ${interaction.guild.name}`)
                                    .setColor("YELLOW")
                            ]
                        });
                    });
                } else {
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setTitle("Missing Pokespawn Channel")
                            .setDescription("Please use `/pokespawns set-channel <channel>` before going any further")
                            .setColor("RED")
                        ]
                    })
                }
            } else {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Missing Permission")
                            .setDescription("You do not have permission to manage channels.")
                            .setColor("RED")
                    ]
                })
            }
        }
    }
}
