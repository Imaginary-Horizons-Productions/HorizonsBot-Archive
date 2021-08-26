const Command = require('../Classes/Command.js');
const { guildID, customEmbeds, isModerator } = require('../helpers.js');

var command = new Command(["EmbedSpliceFields"], // aliases
	"Remove fields from a custom embed (replace unsupported)", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSpliceFields (message ID) (index),, (delete count)`\nReplacing fields unsupported."]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addIntegerOption(option => option.setName("index").setDescription("The field number to start removing fields from (count starts from 0)").setRequired(true))
	.addIntegerOption(option => option.setName("count").setDescription("The number of fields to remove").setRequired(true));

command.execute = (receivedMessage, state) => {
	// Splice fields from the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (customEmbeds[messageID]) {
			let deleteCount = state.messageArray.join(' ');
			deleteCount = deleteCount.split(",, ");
			let index = parseInt(deleteCount.shift());
			if (!isNaN(index)) {
				deleteCount = parseInt(deleteCount[0]);
				if (!isNaN(deleteCount)) {
					receivedMessage.client.guilds.fetch(guildID).then(guild => {
						guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
							let embed = message.embeds[0].spliceFields(index, deleteCount).setTimestamp();
							message.edit({ content: "\u200B", embeds: [embed] });
						})
					})
				} else {
					receivedMessage.author.send(`Please provide an interger for your \`${state.command}\` command delete count.`)
						.catch(console.error);
				}
			} else {
				receivedMessage.author.send(`Please provide an interger for your \`${state.command}\` command index.`)
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
	// Splice fields from the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
		if (customEmbeds[messageID]) {
			let deleteCount = interaction.options.getInteger("count");
			let index = interaction.options.getInteger("index");
			interaction.client.guilds.fetch(guildID).then(guild => {
				guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
					let embed = message.embeds[0].spliceFields(index, deleteCount).setTimestamp();
					message.edit({ embeds: [embed] });
					interaction.reply({ content: `The fields have been removed. Link: ${message.url}`, ephemeral: true })
				}).catch(console.error);
			})
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
