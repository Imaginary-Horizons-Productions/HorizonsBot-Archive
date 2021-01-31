const Command = require('../Classes/Command.js');
const Campaign = require('../Classes/Campaign.js');
const { isModerator, roleIDs, getCampaignList, setCampaignList } = require("../helpers.js");

var command = new Command(["CampaignAdd"],
	"Sets up a text channel and voice channel for a TRPG",
	"Moderator",
	["__Example__ - replace ( ) with your settings"],
	["`@HorizonsBot CampaignAdd (mention the host)`"]);

command.execute = (receivedMessage, state) => {
	// Create a new campaign including a text and voice channel in the receiving channel's category and set the mentioned user as host
	if (isModerator(receivedMessage.author.id)) {
		let hostID = receivedMessage.mentions.users.keyArray().filter(id => id != receivedMessage.client.user.id)[0];
		let channelManager = receivedMessage.guild.channels;
		let category = receivedMessage.channel.parent;

		channelManager.create("new-campaign-text", {
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
			channelManager.create("New Campaign Voice", {
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
						"allow": ["VIEW_CHANNEL"]
					}
				],
				type: "voice"
			}).then(voiceChannel => {
				let campaign = new Campaign();
				campaign.hostID = hostID;
				campaign.channelID = textChannel.id;
				campaign.voiceChannelID = voiceChannel.id;
				let campaignList = getCampaignList();
				campaignList[textChannel.id] = campaign;
				setCampaignList(campaignList);
				textChannel.send(`Welcome to your new campaign text channel <@${hostID}>! As host of this campaign, you can pin and delete messages in this channel. Also, you can use the following commands from this channel to add more details about it in the listing:\n\
				Campaign**Rename**\nCampaign**SetSeats**\nCampaign**SetDescription**\nCampaign**SetSystem**\nCampaign**SetTimeSlot**\nCamapign**SetImage**`)
					.catch(console.error);
			})
		})
	} else {
		receivedMessage.author.send(`Creating new TRPG campaigns is restricted to Moderators.`)
			.catch(console.error);
	}
}

module.exports = command;
