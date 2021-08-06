const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command(["ClubSetImage", "CampaignSetImage"], // aliases
	"Set a club's image url, from text or attachments", // description
	"Moderator or Club Host, use from club channel", // requirements
	["Example - replace [ ] with settings (optional)"], // headings
	["`@HorizonsBot ClubSetImage [url]`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[receivedMessage.channel.id];
	if (club) {
		if (isModerator(receivedMessage.author.id) || (club && receivedMessage.author.id == club.hostID)) {
			let url = state.messageArray.join('');
			if (url == "" && receivedMessage.attachments.array().length > 0) {
				url = receivedMessage.attachments.array()[0].url;
			}
			if (url) {
				club.imageURL = url;
				updateClub(club, receivedMessage.guild.channels);
				receivedMessage.author.send(`${club.title}'s image has been set.`)
					.catch(console.error);
			} else {
				receivedMessage.author.send(`Please provide a url for the club image.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a club image is restricted to the host of that club or Moderators from that club channel.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set club settings from the club channel.`)
			.catch(console.error);
	}
}

module.exports = command;
