const Command = require('../Classes/Command.js');
const { isModerator, getCampaigns, updateCampaign } = require("../helpers.js");

var command = new Command(["CampaignSetSystem"], // aliases
	"Set a campaign's system for", // description
	"Moderator or Campaign Host, use from campaign channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot CampaignSetSystem (system)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving campaign channel
	let campaign = getCampaigns()[receivedMessage.channel.id];
	if (campaign) {
		if (isModerator(receivedMessage.author.id) || receivedMessage.author.id == campaign.hostID) {
			let system = state.messageArray.join(' ');
			if (system) {
				campaign.system = system;
				updateCampaign(campaign, receivedMessage.guild.channels);
				receivedMessage.author.send(`${campaign.title}'s system has been set as ${system}.`)
					.catch(console.error);
			} else {
				receivedMessage.author.send(`Please provide the system for the campaign.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a campaign system is restricted to the host of that campaign or Moderators.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set campaign settings from the campaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
