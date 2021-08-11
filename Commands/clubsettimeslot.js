const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command(["ClubSetTimeSlot", "CampaignSetTimeSlot"], // aliases
	"Set a club's time slot", // description
	"Moderator or Club Host, use from club channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ClubSetTimeSlot (time slot)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[receivedMessage.channel.id];
	if (club) {
		if (isModerator(receivedMessage.author.id) || (club && receivedMessage.author.id == club.hostID)) {
			let timeSlot = state.messageArray.join(' ');
			if (timeSlot) {
				club.timeslot = timeSlot;
				updateClub(club, receivedMessage.guild.channels);
				receivedMessage.author.send(`${club.title}'s time slot has been set as ${timeSlot}.`)
					.catch(console.error);
			} else {
				receivedMessage.author.send(`Please provide the time slot for the club.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a club time slot is restricted to the host of that club or Moderators from that club channel.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set club settings from the club channel.`)
			.catch(console.error);
	}
}

module.exports = command;
