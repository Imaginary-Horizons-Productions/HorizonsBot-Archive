const Command = require('../Classes/Command.js');
const { isModerator, getCampaignList, setCampaignList, updateList } = require("../helpers.js");

var command = new Command(["CampaignSetTimeSlot"], // aliases
	"Sets the time slot for a campaign", // description
	"Moderator or Campaign Host, use from campaign text channel", // requirements
	["__Example__ - replace ( ) with your settings"], // headings
	["`@HorizonsBot CampaignSetTimeSlot (time slot)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving campaign channel
	let campaigns = getCampaignList();
	if (campaigns[receivedMessage.channel.id]) {

	} else {
		receivedMessage.author.send(`Please set campaign settings from the camapaign channel.`)
			.catch(console.error);
	}
	if (isModerator(receivedMessage.author.id) || (campaigns[receivedMessage.channel.id] && receivedMessage.author.id == campaigns[receivedMessage.channel.id].hostID)) {
		let timeSlot = state.messageArray.join(' ');
		if (timeSlot) {
			campaigns[receivedMessage.channel.id].timeslot = timeSlot;
			setCampaignList(campaigns);
			receivedMessage.author.send(`${campaigns[receivedMessage.channel.id].name}'s time slot has been set as ${timeSlot}.`)
				.catch(console.error);
			updateList(receivedMessage.guild.channels, "campaigns");
		} else {
			receivedMessage.author.send(`Please provide the time slot for the campaign.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Setting a campaign time slot is restricted to the host of that campaign or Moderators from that campaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
