const Command = require('../Classes/Command.js');
const { isModerator, getCampaigns, updateCampaign } = require("../helpers.js");

var command = new Command(["CampaignRename"], // aliases
	"Renames a campaign's channels", // description
	"Moderator or Campaign Host, use from campaign text channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot CampaignRename (new name)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Rename the text voice channels associated with receiving channel
	let campaign = getCampaigns()[receivedMessage.channel.id];
	if (campaign) {
		if (isModerator(receivedMessage.author.id) || receivedMessage.author.id == campaign.hostID) {
			let newName = state.messageArray.join('-');
			if (newName) {
				campaign.title = newName;
				receivedMessage.channel.setName(newName);
				receivedMessage.guild.channels.resolve(campaign.voiceChannelID).setName(newName + " Voice");
				updateCampaign(campaign, receivedMessage.guild.channels);
			} else {
				receivedMessage.author.send(`Please provide the new name for the campaign.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Renaming a campaign is restricted to the host of that campaign or Moderators.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set campaign settings from the campaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
