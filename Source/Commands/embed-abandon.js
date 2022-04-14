const Command = require('../../Classes/Command.js');

const options = [{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} }];
const subcomands = [];
module.exports = new Command("embed-abandon", "(moderator) Stop managing the given embed", options, subcomands);

let customEmbeds, isModerator, saveObject;
module.exports.initialize = function (helpers) {
	({ customEmbeds, isModerator, saveObject } = helpers);
}

module.exports.execute = (interaction) => {
	// Stop managing the given embed(s)
	if (isModerator(interaction.user.id)) {
		var messageId = interaction.options.getString("message-id");
		if (customEmbeds[messageId]) {
			delete customEmbeds[messageId];
			saveObject(customEmbeds, "embedsList.json");
			interaction.reply({ content: `The provided embed has been abandoned.`, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `The embed you provided for a \`${interaction.commandName}\` command could not be found.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${interaction.commandName}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}
