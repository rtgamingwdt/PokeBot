const Database = require("../base/Database");
const Event = require("../base/Event");

module.exports = new (class GuildDelete extends Event {
  constructor() {
    super("guildDelete", false);
  }

  async execute(client, guild) {
    if (await Database.getGuildData(guild.id)) {
      await Database.deleteGuildData(guild.id);
    } else {
    }
  }
})();
