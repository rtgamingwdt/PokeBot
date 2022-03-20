const { createCanvas, loadImage } = require("canvas");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const Database = require("../base/Database");
const Event = require("../base/Event");
const { create } = require("../model/GuildModel");


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

      let randomcatchtext = Math.floor(Math.random() *randomcatcharray.length);


      if (chanceOfSpawn == 5) {
        const { data } = await Database.getRandomPokemon();
        const channel = client.channels.cache.get(
          await Database.getPokespawnChannel(message.guild.id)
        );
        channel
          .send({
            embeds: [
              new MessageEmbed()
                .setTitle(`${randomcatcharray[randomcatchtext]}`)
                .setDescription(
                  `A wild ${data.name} has appeared! Type \`catch\` to catch the pokemon!`
                )
                .setColor("YELLOW")
                .setThumbnail(data.sprites.front_default)
                .setTimestamp(),
            ],
          })
          .then((msg) => {
            const filter = (m) =>
              m.content.toLowerCase() == "catch" && m.channel.id == channel.id;
            const collector = channel.createMessageCollector({
              filter,
              time: 30000,
            });

            let said = false;

            collector.on("collect", async (m) => {
              if (
                m.content.toLowerCase() == "catch" &&
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
