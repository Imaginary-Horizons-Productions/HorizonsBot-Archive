const Command = require('../../Classes/Command.js');
const { isModerator, getClubs, updateClub, updateClubDetails, COLORS } = require("../../helpers.js");

module.exports = new Command("club-config", "(club leader or moderator) Configure a club's information");

module.exports.data.addStringOption(option => option.setName("name").setDescription("The new name for the club").setRequired(false))
	.addStringOption(option => option.setName("description").setDescription("The club description is shown in the channel topic").setRequired(false))
	.addStringOption(option => option.setName("game").setDescription("The text to set as the club game").setRequired(false))
	.addIntegerOption(option => option.setName("maxmembers").setDescription("The maximum number of members for the club").setRequired(false))
	.addStringOption(option => option.setName("color").setDescription("The color of the details embed").setRequired(false)
		.addChoices(COLORS.map(color => [color, color])));

module.exports.execute = (interaction) => {
	// Rename the text voice channels associated with receiving channel
	let club = getClubs()[interaction.channel.id];
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
			if (interaction.options.getInteger("maxmembers")) {
				club.seats = interaction.options.getInteger("maxmembers");
				updatedSettings.push("max members");
			}
			if (interaction.options.getString("color")) {
				club.color = interaction.options.getString("color");
				updatedSettings.push("color");
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
