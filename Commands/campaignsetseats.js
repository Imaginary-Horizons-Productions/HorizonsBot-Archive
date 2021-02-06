const Command = require('../Classes/Command.js');
const { isModerator, getCampaignList, updateCampaign, updateList } = require("../helpers.js");

var command = new Command(["CampaignSetSeats"], // aliases
	"Sets the max number of players for a campaign", // description
	"Moderator or Campaign Host, use from campaign text channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot CampaignSetSeats (number)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving campaign channel
	let campaign = getCampaignList()[receivedMessage.channel.id];
	if (campaign) {
		if (isModerator(receivedMessage.author.id) || receivedMessage.author.id == campaign.hostID) {
			let seats = parseInt(state.messageArray[0]);
			if (!isNaN(seats)) {
				campaign.seats = seats;
				updateCampaign(campaign);
				receivedMessage.author.send(`${campaign.title}'s max player count has been set as ${seats}.`)
					.catch(console.error);
				updateList(receivedMessage.guild.channels, "campaigns");
			} else {
				receivedMessage.author.send(`Please provide the max player count for the campaign.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a campaign max player count is restricted to the host of that campaign or Moderators.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set campaign settings from the campaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
