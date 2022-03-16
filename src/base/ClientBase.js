const {
  Client,
  Collection,
  Intents
} = require("discord.js");

const {
  config
} = require("dotenv");

module.exports = class ClientBase extends Client {
  
  constructor(options = {}) {
    super({
      intents: [
        Intents.FLAGS.GUILDS
      ]
    });
    
    config();
    
    this.config = process.env;
    
    this.commandArray = [];
    this.commands = new Collection();
  }
  
  async build() {
    this.login(this.config.TOKEN);
    this.connectDB(this.config.MONGO_URI);
  }
  
  async connectDB(uri) {
    if (uri) {
      await connect(uri).then(() => {
        console.log("CONNECTED TO DATABASE!")
      }).catch((err) => {
        console.log(err);
      })
    } else {
      console.log("DATABASE URI NOT FOUND");
    }
  }
  
  async handleEvents() {
    const files = readdirSync("src/event");
    
    for (const file of files) {
      const event = require(`./event/${file}`);
      
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
        const command = require(`./command/${folder}/${file}`);
        this.commandMap.set(command.get.name, command);
        this.commands.push(command.get.toJSON());
      }
    }

    const rest = new REST({ version: '9' }).setToken(this.config.TOKEN);

    (async () => {
      try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(                     //CLIENT ID             //GUILD ID
          Routes.applicationGuildCommands("941785047692898354", "948135520955932702"),
          { body: this.commands },
        );

        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
    })();
  }
}
