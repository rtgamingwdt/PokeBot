const Event = require("../base/Event");

module.exports = new (class InteractionCreate extends Event {
  constructor() {
    super("interactionCreate", false);
  }

  async execute(client, interaction) {

    const command = client.commands.get(interaction.commandName);

    if (command) {
      command.execute(client, interaction);
    }
  }
})();
