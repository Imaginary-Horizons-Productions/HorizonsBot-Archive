const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command(["ClubRename", "CampaignRename"], // aliases
	"Rename a club's channels", // description
	"Moderator or Club Host, use from club channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ClubRename (new name)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Rename the text voice channels associated with receiving channel
	let club = getClubs()[receivedMessage.channel.id];
	if (club) {
		if (isModerator(receivedMessage.author.id) || receivedMessage.author.id == club.hostID) {
			let newName = state.messageArray.join('-');
			if (newName) {
				club.title = newName;
				receivedMessage.channel.setName(newName);
				receivedMessage.guild.channels.resolve(club.voiceChannelID).setName(newName + " Voice");
				updateClub(club, receivedMessage.guild.channels);
			} else {
				receivedMessage.author.send(`Please provide the new name for the club.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Renaming a club is restricted to the club's host or Moderators.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set club settings from the club channel.`)
			.catch(console.error);
	}
}

module.exports = command;