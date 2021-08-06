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
		let host = receivedMessage.mentions.members.find(member => member.id != receivedMessage.client.user.id);
		if (host) {
			let channelManager = receivedMessage.guild.channels;
			let categoryId = receivedMessage.channel.parentId;

			receivedMessage.guild.roles.fetch(receivedMessage.guild.id).then(everyoneRole => {
				channelManager.create("new-club-text", {
					parent: categoryId,
					permissionOverwrites: [
						{
							"id": channelManager.client.user,
							"allow": ["VIEW_CHANNEL"]
						},
						{
							"id": roleIDs.moderator,
							"allow": ["VIEW_CHANNEL"]
						},
						{
							"id": everyoneRole,
							"deny": ["VIEW_CHANNEL"]
						},
						{
							"id": host,
							"allow": ["VIEW_CHANNEL", "MANAGE_MESSAGES"]
						}
					],
					type: "GUILD_TEXT"
				}).then(textChannel => {
					channelManager.create("New Club Voice", {
						parent: categoryId,
						permissionOverwrites: [
							{
								"id": channelManager.client.user,
								"allow": ["VIEW_CHANNEL"]
							},
							{
								"id": roleIDs.moderator,
								"allow": ["VIEW_CHANNEL"]
							},
							{
								"id": everyoneRole,
								"deny": ["VIEW_CHANNEL"]
							},
							{
								"id": host,
								"allow": ["VIEW_CHANNEL", "MANAGE_CHANNELS"]
							}
						],
						type: "GUILD_VOICE"
					}).then(voiceChannel => {
						let club = new Club();
						club.title = "new club";
						club.hostID = host.id;
						club.channelID = textChannel.id;
						club.voiceChannelID = voiceChannel.id;
						updateClub(club, receivedMessage.guild.channels);
						textChannel.send(`Welcome to your new club text channel ${host}! As club host, you can pin and delete messages in this channel. Also, you can use the following commands from this channel to add more details about it in the listing:\nClub**Rename**\nClub**SetSeats**\nClub**SetDescription**\nClub**SetSystem**\nClub**SetTimeSlot**\nClub**SetImage**`);
					}).catch(console.error);
				})
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
