const Command = require('../../Classes/Command.js');
const { isModerator, getClubs, updateClub, updateClubDetails, COLORS, setClubReminderTimeout } = require("../../helpers.js");

let options = [
	{ type: "String", name: "name", description: "The new name for the club", required: false, choices: {} },
	{ type: "String", name: "description", description: "The club description is shown in the channel topic", required: false, choices: {} },
	{ type: "String", name: "game", description: "The text to set as the club game", required: false, choices: {} },
	{ type: "Integer", name: "max-members", description: "The maximum number of members for the club", required: false, choices: {} },
	{
		type: "String", name: "color", description: "The color of the details embed", required: false, choices: COLORS.reduce((object, color) => {
			object[color.toLowerCase().replace(/_/g, " ")] = color;
			return object;
		}, {})
	}
];
module.exports = new Command("club-config", "(club leader or moderator) Configure a club's information", options);

module.exports.execute = (interaction) => {
	// Rename the text voice channels associated with receiving channel
	let club = getClubs()[interaction.channelId];
	if (club) {
		if (isModerator(interaction.user.id) || interaction.user.id == club.hostID) {
			var updatedSettings = [];
			if (interaction.options.getString("name")) {
				club.title = interaction.options.getString("name");
				interaction.channel.setName(club.title);
				interaction.guild.channels.resolve(club.voiceChannelID).setName(club.title + " Voice");
				updatedSettings.push("name");
			}
			if (interaction.options.getString("description")) {
				club.description = interaction.options.getString("description");
				interaction.channel.setTopic(club.description);
				updatedSettings.push("description");
			}
			if (interaction.options.getString("game")) {
				club.system = interaction.options.getString("game");
				updatedSettings.push("game");
			}
			if (interaction.options.getString("color")) {
				club.color = interaction.options.getString("color");
				updatedSettings.push("color");
			}
			if (interaction.options.getInteger("max-members")) {
				club.seats = interaction.options.getInteger("max-members");
				updatedSettings.push("max members");
				setClubReminderTimeout(club, interaction.guild.channels);
			}
			updateClubDetails(club, interaction.channel);
			updateClub(club, interaction.guild.channels);
			interaction.reply({ content: `The following club setting(s) have been updated: ${updatedSettings.join(', ')}`, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Configuring club settings is restricted to the club leader and Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please configure club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}
