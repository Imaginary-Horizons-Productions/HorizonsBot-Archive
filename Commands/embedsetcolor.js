const Command = require('../Classes/Command.js');
const { guildID, customEmbeds, isModerator } = require('../helpers.js');

var command = new Command(["EmbedSetColor", "EmbedSetColour"], // aliases
	"Assign a custom embed's color", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetColor (message ID) (color hexcode)`"]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addStringOption(option => option.setName("color").setDescription("The hexcode of the color").setRequired(true));

command.execute = (receivedMessage, state) => {
	// Set the color for the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (customEmbeds[messageID]) {
			let colorCode = state.messageArray[0];
			if (colorCode.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)) {
				receivedMessage.client.guilds.fetch(guildID).then(guild => {
					guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setColor(colorCode).setTimestamp();
						message.edit({ content: "\u200B", embeds: [embed] });
					})
				})
			} else {
				receivedMessage.author.send(`Please provide color in hex code format (#000000).`)
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
	// Set the color for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
		if (customEmbeds[messageID]) {
			let colorCode = interaction.options.getString("color");
			if (colorCode.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)) {
				interaction.client.guilds.fetch(guildID).then(guild => {
					guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setColor(colorCode).setTimestamp();
						message.edit({ embeds: [embed] });
						interaction.reply({ content: `The embed's color has been updated. Link: ${message.url}`, ephemeral: true });
					})
				})
			} else {
				interaction.reply({ content: `Please provide color in hex code format (#000000).`, ephemeral: true })
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
