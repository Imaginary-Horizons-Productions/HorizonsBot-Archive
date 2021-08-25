const Command = require('../Classes/Command.js');
const { guildID, customEmbeds, isModerator } = require('../helpers.js');

var command = new Command(["EmbedAddField"], // aliases
	"Add a custom embed field", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedAddField (message ID) (header),, (text),, [inline (default: false)]`"]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addStringOption(option => option.setName("header").setDescription("The header for the new field").setRequired(true))
	.addStringOption(option => option.setName("text").setDescription("The text of the new field").setRequired(true))
	.addBooleanOption(option => option.setName("inline").setDescription("Whether to show the field in-line with previous embed fields").setRequired(false));

command.execute = (receivedMessage, state) => {
	// Add a field to the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (customEmbeds[messageID]) {
			let inline = state.messageArray.join(' ');
			inline = inline.split(",, ");
			let header = inline.shift();
			if (header) {
				let text = inline.shift();
				if (text) {
					if (inline.length > 0 && inline[0].toLowerCase() == "true") {
						inline = true;
					} else {
						inline = false;
					}
					receivedMessage.client.guilds.fetch(guildID).then(guild => {
						guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
							let embed = message.embeds[0].addField(header, text, inline).setTimestamp();
							message.edit({ content: "\u200B", embeds: [embed] });
						})
					})
				} else {
					receivedMessage.author.send(`Your field value for a \`${state.command}\` command could not be parsed.`)
						.catch(console.error);
				}
			} else {
				receivedMessage.author.send(`Your field name for a \`${state.command}\` command could not be parsed.`)
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
	// Add a field to the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
		if (customEmbeds[messageID]) {
			let inline = interaction.options.getBoolean("inline");
			let header = interaction.options.getString("header");
			let text = interaction.options.getString("text");
			interaction.client.guilds.fetch(guildID).then(guild => {
				guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
					let embed = message.embeds[0].addField(header, text, inline).setTimestamp();
					message.edit({ embeds: [embed] });
					interaction.reply({ content: `A field has been added to the embed. Link: ${message.url}`, ephemeral: true })
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
