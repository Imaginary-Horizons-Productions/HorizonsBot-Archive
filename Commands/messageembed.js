const Command = require('../Classes/Command.js');
const { MessageEmbed, Permissions } = require('discord.js');
const { embedsList, saveObject } = require('../helpers.js');

var command = new Command(["MessageEmbed"], // aliases
	"Makes a new MessageEmbed, configurable with other commands", // description
	"Permission to Manage Webhooks", // requirements
	["Example"], // headings
	["`@HorizonsBot MessageEmbed`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Create a new MessageEmbed
	if (receivedMessage.member.hasPermission(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
		let embed = new MessageEmbed().setTimestamp();
		receivedMessage.channel.send("Here's your new embed.", embed).then(message => {
			embedsList[message.id] = message.channel.id;
			saveObject(embedsList, "embedsList.json");
		}).catch(console.error);
	} else {
		receivedMessage.author.send(`You need permission to manage webhooks to use the \`${state.command}\` command.`)
			.catch(console.error);
	}
}

module.exports = command;
