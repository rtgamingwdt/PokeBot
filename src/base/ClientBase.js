const { Client, Collection, Intents } = require("discord.js");

const { config } = require("dotenv");

const { connect } = require("mongoose");

const chalk = require("chalk"); // you cant´require chalk like that you need to use imports cause of ESM

const { readdirSync } = require("fs");

const { REST } = require("@discordjs/rest");

const { Routes } = require("discord-api-types/v9");
const Database = require("./Database");

module.exports = class ClientBase extends Client {

  constructor(options = {}) {
    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });
    
    config();

    this.config = process.env;

    this.commandArray = [];
    this.commands = new Collection();
  }

  async build() {
    this.login(this.config.TOKEN);
    this.connectDB(this.config.MONGO_URI);
    this.handleEvents();
    this.handleCommands();
  }

  async connectDB(uri) {
    if (uri) {
      await connect(uri)
        .then(() => {
          console.log(chalk.red("CONNECTED TO DATABASE!"));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(chalk.red("DATABASE URI NOT FOUND"));
    }
  }

  async handleEvents() {
    const files = readdirSync("src/event");

    for (const file of files) {
      const event = require(`../event/${file}`);

      if (event.isOnce()) {
        this.once(event.getName(), event.execute.bind(null, this));
      } else {
        this.on(event.getName(), event.execute.bind(null, this));
      }
    }
  }

  async handleCommands() {
    const folders = readdirSync("src/command");

    for (const folder of folders) {
      const files = readdirSync(`src/command/${folder}`);

      for (const file of files) {
        const command = require(`../command/${folder}/${file}`);
        this.commands.set(command.get.name, command);
        this.commandArray.push(command.get.toJSON());
      }
    }

    const rest = new REST({ version: "9" }).setToken(this.config.TOKEN);

    (async () => {
      try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(
          //CLIENT ID             //GUILD ID
          Routes.applicationGuildCommands(
            "941785047692898354",
            "953072048576536596"
          ),
          { body: this.commandArray }
        );

        // await rest.get(Routes.applicationCommands("941785047692898354"))
        //   .then(data => {
        //     const promises = [];
        //     for (const command of data) {
        //       const deleteUrl = `${Routes.applicationCommands("941785047692898354")}/${command.id}`;
        //       promises.push(rest.delete(deleteUrl));
        //     }
        //     return Promise.all(promises);
        //   });

        console.log(chalk.cyan("Successfully reloaded application (/) commands."));
      } catch (error) {
        console.error(error);
      }
    })();
  }

  async getConfig() {
    return this.config;
  }

  // async getDatabase() {
  //   return this.database;
  // }
};
