const Command = require('../Classes/Command.js');
const { isModerator, getCampaigns, updateCampaign } = require("../helpers.js");

var command = new Command(["CampaignSetDescription"], // aliases
	"Set a campaign's description", // description
	"Moderator or Campaign Host, use from campaign channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot CampaignSetDecription (description)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving campaign channel
	let campaign = getCampaigns()[receivedMessage.channel.id];
	if (campaign) {
		if (isModerator(receivedMessage.author.id) || receivedMessage.author.id == campaign.hostID) {
			let description = state.messageArray.join(' ');
			if (description) {
				campaign.description = description;
				receivedMessage.channel.setTopic(description);
				updateCampaign(campaign, receivedMessage.guild.channels);
			} else {
				receivedMessage.author.send(`Please provide the description for the campaign.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a campaign description is restricted to the host of that campaign or Moderators.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set campaign settings from the campaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
