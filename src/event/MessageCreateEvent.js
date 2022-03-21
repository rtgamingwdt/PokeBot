const { createCanvas, loadImage } = require("canvas");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const Database = require("../base/Database");
const Event = require("../base/Event");
const { readdirSync } = require("fs");

module.exports = new (class MessageCreate extends Event {
  constructor() {
    super("messageCreate", false);
  }

  async execute(client, message) {
    if (
      message.author.bot ||
      message.channel.type == "DM" ||
      message.content == "catch"
    )
      return;
    const guildData = await Database.getGuildData(message.guild.id);

    if (guildData.spawns) {
      const chanceOfSpawn = Math.floor(Math.random() * (5 - 1 + 1) + 1);

      // console.log(chanceOfSpawn);
      const randomcatcharray = [
        "A wild pokemon has appeared!",
        "Ohh! Look there is a pokèmon in the grass!"
      ]

      let randomcatchtext = Math.floor(Math.random() * randomcatcharray.length);


      console.log(chanceOfSpawn);

      if (chanceOfSpawn == 5) {
        const { data } = await Database.getRandomPokemon();
        const channel = client.channels.cache.get(
          await Database.getPokespawnChannel(message.guild.id)
        );
        
        const canvas = createCanvas(700, 700);
        const ctx = canvas.getContext('2d');
        const scenery = await loadImage("https://wallpaperaccess.com/full/3551101.png");
        const dialog = await loadImage("https://cdn.discordapp.com/attachments/954166907089612861/955202334152065024/Dialog_Box.png");
        const pokemon = await loadImage(`${data.sprites.front_default}`);

        ctx.drawImage(scenery, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(dialog, 0, 525, canvas.width, 175);
        ctx.drawImage(pokemon, 223, 223, 255, 225);

        ctx.font = `bold 20px Sans`;
        ctx.fillStyle = `white`;
        // ctx.textAlign = "start";
        ctx.shadowBlur = 100;

        ctx.fillText(`\nA wild ${data.name}, has appeared!\nHurry up and type catch before they run away!`, 30, 560);

        const attachment = new MessageAttachment(canvas.toBuffer(), `${data.name}.png`);

        channel
          .send({
            files: [
              attachment
            ]
          })
          .then((msg) => {
            const filter = (m) =>
              m.content.toLowerCase().startsWith("catch") && m.channel.id == channel.id;
            const collector = channel.createMessageCollector({
              filter,
              time: 30000,
            });

            let said = false;

            collector.on("collect", async (m) => {
              if (
                m.content.toLowerCase().startsWith("catch") &&
                m.channel.id == channel.id
              ) {
                if (!(await Database.getUserData(m.author.id)))
                  return channel.send({
                    embeds: [
                      new MessageEmbed()
                        .setTitle("Hey! You! Start Your Pokemon Journey Today!")
                        .setDescription(
                          "You cannot catch any pokemon until you have recieved your starter pokemon! You can get started by using the `start` command!"
                        )
                        .setColor("RED"),
                    ],
                  });
                const catchChance = Math.floor(Math.random() * (2 - 1 + 1) + 1);

                console.log(catchChance);

                if (catchChance == 2) {
                  said = true;
                  await Database.givePokemon(
                    message.author.id,
                    `${data.name}`
                  ).then(() => {
                    msg.edit({
                      embeds: [
                        new MessageEmbed()
                          .setTitle("Catch Successful!")
                          .setDescription(
                            `${m.author.tag}, has caught ${data.name}!`
                          )
                          .setColor("GREEN"),
                      ],
                    });
                  });
                  collector.stop();
                } else {
                  msg.edit({
                    embeds: [
                      new MessageEmbed()
                        .setTitle("Catch Failed.")
                        .setDescription(
                          `${m.author.tag}, failed to catch ${data.name} because it ran away!`
                        )
                        .setColor("RED"),
                    ],
                  });
                  collector.stop();
                }
              }
            });

            collector.on("end", () => {
              if (!said) {
                msg.edit({
                  embeds: [
                    new MessageEmbed()
                      .setDescription(`${data.name}, has ran away.`)
                      .setColor("RED")
                  ]
                })
              }
            });
          });
      }
    }
  }
})();
