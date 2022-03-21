const { createCanvas, loadImage, registerFont } = require("canvas");
const { MessageAttachment } = require("discord.js");
const Command = require("./Command");

module.exports = class Utility extends Command {

    static async slap(interaction, user1, user2) {
        
        const avatar1 = user1.displayAvatarURL({
            format: "png"
        });
        const avatar2 = user2.displayAvatarURL({
            format: "png"
        });

        const canvas = createCanvas(498, 371);
        const ctx = canvas.getContext("2d");

        const background = await loadImage("https://cdn.discordapp.com/attachments/954440804091457547/955224620104048690/frame_03_delay-0.png");
        const image1 = await loadImage(avatar1);
        const image2 = await loadImage(avatar2);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(image1, 299, 122, 128, 128);
        ctx.drawImage(image2, 56, 100, 128, 128);

        const data = canvas.toBuffer();

        const attachment = new MessageAttachment(data, "slap.png");

        return attachment;
    }
}