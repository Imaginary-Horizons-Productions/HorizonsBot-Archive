const Command = require('../Classes/Command.js');
const { guildID, customEmbeds, isModerator } = require('../helpers.js');

var command = new Command(["EmbedSetURL"], // aliases
	"Assign a custom embed's title url", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetURL (message ID) (url)`"]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addStringOption(option => option.setName("url").setDescription("The url to go to when clicking the title field").setRequired(true));

command.execute = (receivedMessage, state) => {
	// Set the title url for the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (customEmbeds[messageID]) {
			let url = state.messageArray[0];
			if (url) {
				receivedMessage.client.guilds.fetch(guildID).then(guild => {
					guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setURL(url).setTimestamp();
						message.edit({ content: "\u200B", embeds: [embed] });
					})
				})
			} else {
				receivedMessage.author.send(`Your url for a \`${state.command}\` command could not be parsed.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`The embed you provided for a \`${state.command}\` command could not be found.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`You must be a Moderator to use the \`${state.command}\` command.`)
			.catch(console.error);
	}
}

command.executeInteraction = (interaction) => {
	// Set the title url for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
		if (customEmbeds[messageID]) {
			let url = interaction.options.getString("url");
			if (url) {
				interaction.client.guilds.fetch(guildID).then(guild => {
					guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setURL(url).setTimestamp();
						message.edit({ embeds: [embed] });
						interaction.reply({ content: `The embed's url has been updated. Link: ${message.url}`, ephemeral: true });
					}).catch(console.error);
				})
			} else {
				interaction.reply({ content: `Your url for a \`${interaction.commandName}\` command could not be parsed.`, ephemeral: true })
					.catch(console.error);
			}
		} else {
			interaction.reply({ content: `The embed you provided for a \`${interaction.commandName}\` command could not be found.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${interaction.commandName}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
