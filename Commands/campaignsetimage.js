const Command = require('../Classes/Command.js');
const { isModerator, getCampaignList, updateCampaign, updateList } = require("../helpers.js");

var command = new Command(["CampaignSetImage"], // aliases
	"Sets the image url for a campaign", // description
	"Moderator or Campaign Host, use from campaign text channel", // requirements
	["__Example__ - replace ( ) with your settings"], // headings
	["`@HorizonsBot CampaignSetImage (url)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving campaign channel
	let campaign = getCampaignList()[receivedMessage.channel.id];
	if (campaign) {
		if (isModerator(receivedMessage.author.id) || (campaign && receivedMessage.author.id == campaign.hostID)) {
			let url = state.messageArray.join('') || receivedMessage.attachments.array()[0].url;
			if (url) {
				campaign.imageURL = url;
				updateCampaign(campaign);
				receivedMessage.author.send(`${campaign.name}'s image has been set.`)
					.catch(console.error);
				updateList(receivedMessage.guild.channels, "campaigns");
			} else {
				receivedMessage.author.send(`Please provide a url for the campaign image.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a campaign image is restricted to the host of that campaign or Moderators from that campaign channel.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set campaign settings from the campaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
