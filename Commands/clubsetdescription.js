const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command(["ClubSetDescription", "CampaignSetDescription"], // aliases
	"Set a club's description", // description
	"Moderator or Club Host, use from club channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ClubSetDecription (description)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[receivedMessage.channel.id];
	if (club) {
		if (isModerator(receivedMessage.author.id) || receivedMessage.author.id == club.hostID) {
			let description = state.messageArray.join(' ');
			if (description) {
				club.description = description;
				receivedMessage.channel.setTopic(description);
				updateClub(club, receivedMessage.guild.channels);
			} else {
				receivedMessage.author.send(`Please provide the description for the club.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a club description is restricted to the host of that club or Moderators.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set club settings from the club channel.`)
			.catch(console.error);
	}
}

module.exports = command;
