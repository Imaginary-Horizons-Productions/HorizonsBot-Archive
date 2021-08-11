const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command(["ClubSetSeats", "CampaignSetSeats"], // aliases
	"Set a club's max number of members", // description
	"Moderator or Club Host, use from club channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ClubSetSeats (number)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[receivedMessage.channel.id];
	if (club) {
		if (isModerator(receivedMessage.author.id) || receivedMessage.author.id == club.hostID) {
			let seats = parseInt(state.messageArray[0]);
			if (!isNaN(seats)) {
				club.seats = seats;
				updateClub(club, receivedMessage.guild.channels);
				receivedMessage.author.send(`${club.title}'s max member count has been set as ${seats}.`)
					.catch(console.error);
			} else {
				receivedMessage.author.send(`Please provide the max member count for the club.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a club max member count is restricted to the host of that club or Moderators.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set club settings from the club channel.`)
			.catch(console.error);
	}
}

module.exports = command;
