const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');
const { isModerator, customEmbeds, saveObject } = require('../helpers.js');

var command = new Command(["EmbedCreate"], // aliases
	"Make a new MessageEmbed, configurable with other commands", // description
	"Moderator, use from a server channel", // requirements
	["Usage"], // headings
	["`@HorizonsBot EmbedCreate`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Create a new MessageEmbed
	if (receivedMessage.guild) {
		if (isModerator(receivedMessage.author.id)) {
			let embed = new MessageEmbed().setFooter("Custom Embed").setTimestamp();
			receivedMessage.channel.send({ content: "Here's your new embed.", embeds: [embed] }).then(message => {
				customEmbeds[message.id] = message.channel.id;
				saveObject(customEmbeds, "embedsList.json");
			}).catch(console.error);
		} else {
			receivedMessage.author.send(`You must be a Moderator to use the \`${state.command}\` command.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`The \`${state.command}\` command must be used from a server channel.`)
			.catch(console.error);
	}
}

command.executeInteraction = (interaction) => {
	// Create a new MessageEmbed
	if (interaction.guild) {
		if (isModerator(interaction.user.id)) {
			let embed = new MessageEmbed().setFooter("Custom Embed").setTimestamp();
			interaction.channel.send({ embeds: [embed] }).then(message => {
				customEmbeds[message.id] = message.channel.id;
				saveObject(customEmbeds, "embedsList.json");
				interaction.reply({ content: "Here's your new embed.", ephemeral: true });
			}).catch(console.error);
		} else {
			interaction.reply({ content: `You must be a Moderator to use the \`${state.command}\` command.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `The \`${state.command}\` command must be used from a server channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
