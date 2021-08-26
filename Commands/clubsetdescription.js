const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command(["ClubSetDescription", "CampaignSetDescription"], // aliases
	"Set a club's description", // description
	"Moderator or Club Host, use from club channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ClubSetDecription (description)`"]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("description").setDescription("The text to set as the club description").setRequired(true));

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

command.executeInteraction = (interaction) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || interaction.user.id == club.hostID) {
			club.description = interaction.options.getString("description");
			interaction.channel.setTopic(club.description);
			updateClub(club, interaction.guild.channels);
			interaction.reply({ content: "The club's description has been updated.", ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Setting a club description is restricted to the host of that club or Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please set club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
