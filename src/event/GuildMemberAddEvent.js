const Database = require("../base/Database");
const Event = require("../base/Event");
const { MessageAttachment } = require("discord.js");
const { WelcomerDiscord } = require("discord-welcomer");
const { welcome } = new WelcomerDiscord;

module.exports = new (class GuildMemberAdd extends Event {
    constructor() {
        super("guildMemberAdd", false);
    }

    async execute(client, member) {
        const channel = await member.guild.channels.cache.find((ch) => ch.name.includes("general"));
        if (!channel) return;

        const data = await welcome(member, {
            link: "https://images.wallpapersden.com/image/download/pokemon-pikachu-art_a25tbW6UmZqaraWkpJRmbmdlrWZlbWU.jpg",
            text: "Welcome!",
            text_color: "yellow",
            username_color: "blue"
          });

        const attachment = new MessageAttachment(data, "welcome-image.png");

        channel.send({
            files: [
                attachment
            ]
        });
    }
})();
