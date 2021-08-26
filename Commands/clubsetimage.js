const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command(["ClubSetImage", "CampaignSetImage"], // aliases
	"Set or clear a club's image url", // description
	"Moderator or Club Host, use from club channel", // requirements
	["Example - replace [ ] with settings (optional)"], // headings
	["`@HorizonsBot ClubSetImage [url]`"]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("url").setDescription("The url to the image to set for the club").setRequired(false));

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[receivedMessage.channel.id];
	if (club) {
		if (isModerator(receivedMessage.author.id) || (club && receivedMessage.author.id == club.hostID)) {
			let url = state.messageArray.join('');
			if (url == "" && Array.from(receivedMessage.attachments.values).length > 0) {
				url = receivedMessage.attachments.first().url;
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

command.executeInteraction = (interaction) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || (club && interaction.user.id == club.hostID)) {
			let url = interaction.options.getString("url");
			if (url) {
				club.imageURL = url;
				interaction.reply({ content: `${club.title}'s image has been set.`, ephemeral: true })
					.catch(console.error);
			} else {
				club.imageURL = "";
				interaction.reply({ content: `${club.title}'s image has been cleared.`, ephemeral: true })
					.catch(console.error);
			}
			updateClub(club, interaction.guild.channels);
		} else {
			interaction.reply({ content: `Setting a club image is restricted to the host of that club or Moderators from that club channel.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please set club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
