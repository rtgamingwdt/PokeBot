const Database = require("../base/Database");
const Event = require("../base/Event");

module.exports = new (class GuildCreate extends Event {
  constructor() {
    super("guildCreate", false);
  }

  async execute(client, guild) {
    if (!(await Database.getGuildData(guild.id))) {
      await Database.createGuildData(guild.id);
    } else {
    }
  }
})();
