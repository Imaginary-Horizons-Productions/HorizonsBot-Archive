const Command = require('../Classes/Command.js');
const Club = require('../Classes/Club.js');
const { isModerator, roleIDs, updateClub } = require("../helpers.js");

var command = new Command(["ClubAdd", "CampaignAdd"],
	"Set up a text and voice channels for a club",
	"Moderator",
	["__Example__ - replace ( ) with your settings"],
	["`@HorizonsBot ClubAdd (mention the host)`"]);

command.execute = (receivedMessage, state) => {
	// Create a new club including a text and voice channel in the receiving channel's category and set the mentioned user as host
	if (isModerator(receivedMessage.author.id)) {
		let hostID = receivedMessage.mentions.users.keyArray().filter(id => id != receivedMessage.client.user.id)[0];
		if (hostID) {
			let channelManager = receivedMessage.guild.channels;
			let category = receivedMessage.channel.parent;

			channelManager.create("new-club-text", {
				parent: category,
				permissionOverwrites: [
					{
						"id": channelManager.client.user.id,
						"allow": 268436480 // VIEW_CHANNEL and "Manage Permissions" set to true
					},
					{
						"id": roleIDs.moderator,
						"allow": ["VIEW_CHANNEL"]
					},
					{
						"id": channelManager.guild.id, // use the guild id for @everyone
						"deny": ["VIEW_CHANNEL"]
					},
					{
						"id": hostID,
						"allow": ["VIEW_CHANNEL", "MANAGE_MESSAGES"]
					}
				],
				type: "text"
			}).then(textChannel => {
				channelManager.create("New Club Voice", {
					parent: category,
					permissionOverwrites: [
						{
							"id": channelManager.client.user.id,
							"allow": 268436480 // VIEW_CHANNEL and "Manage Permissions" set to true
						},
						{
							"id": roleIDs.moderator,
							"allow": ["VIEW_CHANNEL"]
						},
						{
							"id": channelManager.guild.id, // use the guild id for @everyone
							"deny": ["VIEW_CHANNEL"]
						},
						{
							"id": hostID,
							"allow": ["VIEW_CHANNEL", "MANAGE_CHANNELS"]
						}
					],
					type: "voice"
				}).then(voiceChannel => {
					let club = new Club();
					club.title = "new club";
					club.hostID = hostID;
					club.channelID = textChannel.id;
					club.voiceChannelID = voiceChannel.id;
					updateClub(club, receivedMessage.guild.channels);
					textChannel.send(`Welcome to your new club text channel <@${hostID}>! As club host, you can pin and delete messages in this channel. Also, you can use the following commands from this channel to add more details about it in the listing:\nClub**Rename**\nClub**SetSeats**\nClub**SetDescription**\nClub**SetSystem**\nClub**SetTimeSlot**\nClub**SetImage**`);
				}).catch(console.error);
			})
		} else {
			receivedMessage.author.send(`Please mention the host of the new club.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Creating new clubs is restricted to Moderators.`)
			.catch(console.error);
	}
}

module.exports = command;
