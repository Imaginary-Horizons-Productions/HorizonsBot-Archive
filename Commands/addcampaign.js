const Command = require('../Classes/Command.js');
const Campaign = require('../Classes/Campaign.js');
const { Permissions } = require('discord.js');

var command = new Command(["AddCampaign"],
	"Sets up a text channel and voice channel for a TRPG",
	"Permission to Manage Channels",
	["__Example__ - replace ( ) with your settings"],
	["`@HorizonsBot AddCampaign (mention the host)`"]);

command.execute = (receivedMessage, state) => {
	// Create a new campaign including a text and voice channel in the receiving channel's category and set the mentioned user as host
	if (receivedMessage.member.hasPermission(Permissions.FLAGS.MANAGE_CHANNELS)) {
		let hostID = ''; //TODO mentioned user (first argument)
		let sourceChannel = receivedMessage.channel;
		let category = sourceChannel.parent;

		sourceChannel.clone({
			name: "New Campaign Text",
			parent: category,
			permissionsOverwrite: {
				//TODO invisible to @everyone (except campaign host and TRPGTrackerBot)
				//TODO manage messages for campaign host
			},
			type: "" //TODO text
		}).then(textChannel => {
			sourceChannel.clone({
				name: "New Campaign Voice",
				parent: category,
				permissionsOverwrite: {
					//TODO invisible to @everyone (except campaign host and TRPGTrackerBot)
				},
				type: "" //TODO voice
			}).then(voiceChannel => {
				let campaign = new Campaign();
				campaign.hostID = hostID;
				campaign.textChannelID = textChannel.id;
				campaign.voiceChannelID = voiceChannel.id;
				//TODO add campaign to dictionary
				textChannel.send(getString(state.locale, command.module, "successMessage"));
				//Message: A new campaign has been successfully created! You can use the following commands from this channel to add more details about it in the listing: `renamecampaign`, `setdescription`, `setseats`, `setsystem`, `settimeslot`, `setimage`
			})
		})
	} else {
		receivedMessage.author.send(`You need the MANAGE_CHANNELS permission to use the \`${state.command}\` command.`)
			.catch(console.error);
	}
}

module.exports = command;
