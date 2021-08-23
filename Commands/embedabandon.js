const Command = require('../Classes/Command.js');
const { customEmbeds, isModerator, saveObject } = require('../helpers.js');

var command = new Command(["EmbedAbandon"], // aliases
	"Stop managing the given embed(s)", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedAbandon (message ID)`"]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true));

command.execute = (receivedMessage, state) => {
	// Stop managing the given embed(s)
	if (isModerator(receivedMessage.author.id)) {
		state.messageArray.forEach(messageID => {
			if (customEmbeds[messageID]) {
				delete customEmbeds[messageID];
				saveObject(customEmbeds, "embedsList.json");
				receivedMessage.author.send(`The provided embed has been abandoned.`)
					.catch(console.error);
			} else {
				receivedMessage.author.send(`The embed you provided for a \`${state.command}\` command could not be found.`)
					.catch(console.error);
			}
		})
	} else {
		receivedMessage.author.send(`You must be a Moderator to use the \`${state.command}\` command.`)
			.catch(console.error);
	}
}

command.executeInteraction = (interaction) => {
	// Stop managing the given embed(s)
	if (isModerator(interaction.user.id)) {
		var messageId = interaction.options.getString("messageid");
		if (customEmbeds[messageId]) {
			delete customEmbeds[messageId];
			saveObject(customEmbeds, "embedsList.json");
			interaction.reply({ content: `The provided embed has been abandoned.`, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `The embed you provided for a \`${state.command}\` command could not be found.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${state.command}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
