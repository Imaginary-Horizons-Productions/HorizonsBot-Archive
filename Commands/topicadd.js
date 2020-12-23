const Command = require('../Classes/Command.js');
const Topic = require('../Classes/Topic.js');
const { Permissions } = require('discord.js');
const { topicList, roleIDs, saveObject } = require('../helpers.js');

var command = new Command(["TopicAdd"], // aliases
	"Sets up an opt-in text channel for the given topic", // description
	"Permission to Manage Channels, use the command from a server channel in the category to creat the new channel in", // requirements
	["__Example__ - replace ( ) with your settings"], // headers
	[`@HorizonsBot TopicAdd (topic name)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Creates a new opt-in text channel for the given topic, adds it to list of topic channels
	if (receivedMessage.member.hasPermission(Permissions.FLAGS.MANAGE_CHANNELS)) {
		let topicName = state.messageArray.join('-');
		receivedMessage.channel.clone({
			"name": topicName,
			"permissionOverwrites": [
				{
					"id":receivedMessage.client.user.id,
					"allow": ["VIEW_CHANNEL"]
				},
				{
					"id": receivedMessage.guild.id, // use the guild id for @everyone
					"deny": ["VIEW_CHANNEL"]
				},
				{
					"id": roleIDs.moderator,
					"allow": ["VIEW_CHANNEL"]
				}
			]
		}).then(channel => {
			topicList[channel.id] = new Topic(channel.id, channel.name);
			saveObject(topicList, "topicList.json");
		})
	} else {
		receivedMessage.author.send(`You need the MANAGE_CHANNELS permission to use the \`${state.command}\` command.`)
			.catch(console.error);
	}
}

module.exports = command;
