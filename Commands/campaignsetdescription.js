const Command = require('../Classes/Command.js');
const { isModerator, getCampaignList, setCampaignList, updateList } = require("../helpers.js");

var command = new Command(["CampaignSetDescription"], // aliases
	"Sets the description for a campaign", // description
	"Moderator or Campaign Host, use from campaign text channel", // requirements
	["__Example__ - replace ( ) with your settings"], // headings
	["`@HorizonsBot CampaignSetDecription (description)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving campaign channel
	let campaigns = getCampaignList();
	if (isModerator(receivedMessage.author.id) || (campaigns[receivedMessage.channel.id] && receivedMessage.author.id == campaigns[receivedMessage.channel.id].hostID)) {
		let description = state.messageArray.join(' ');
		if (description) {
			campaigns[receivedMessage.channel.id].description = description;
			receivedMessage.channel.setTopic(description);
			setCampaignList(campaigns);
			updateList(receivedMessage.guild.channels, "campaigns");
		} else {
			receivedMessage.author.send(`Please provide the description for the campaign.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Setting a campaign description is restricted to the host of that campaign or Moderators from that campaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
