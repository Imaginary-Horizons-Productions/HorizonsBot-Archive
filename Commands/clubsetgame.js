const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command(["ClubSetGame", "CampaignSetGame", "CampaignSetSystem"], // aliases
	"Set the name a club's game", // description
	"Moderator or Club Host, use from club channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ClubSetSystem (system)`"]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("game").setDescription("The text to set as the club game").setRequired(true));

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[receivedMessage.channel.id];
	if (club) {
		if (isModerator(receivedMessage.author.id) || receivedMessage.author.id == club.hostID) {
			let system = state.messageArray.join(' ');
			if (system) {
				club.system = system;
				updateClub(club, receivedMessage.guild.channels);
				receivedMessage.author.send(`${club.title}'s game has been set as ${system}.`)
					.catch(console.error);
			} else {
				receivedMessage.author.send(`Please provide the game for the club.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a club game is restricted to the host of that club or Moderators.`)
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
			club.system = interaction.options.getString("game");
			updateClub(club, interaction.guild.channels);
			interaction.reply({ content: `${club.title}'s game has been set as ${club.system}.`, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Setting a club game is restricted to the host of that club or Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please set club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
