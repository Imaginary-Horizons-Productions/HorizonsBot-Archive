const Command = require('../../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../../helpers.js");

module.exports = new Command("club-set-image", "Set or clear a club's image url");

module.exports.data.addStringOption(option => option.setName("url").setDescription("The url to the image to set for the club").setRequired(false));

module.exports.execute = (interaction) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || (club && interaction.user.id == club.hostID)) {
			let url = interaction.options.getString("url");
			if (url) {
				var validURL = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/, 'gi').test(url);
				if (validURL) {
					club.imageURL = url;
					interaction.reply({ content: `${club.title}'s image has been set.`, ephemeral: true })
						.catch(console.error);
				} else {
					interaction.reply({ content: "Your input for url does not appear to be a url.", ephemeral: true })
						.catch(console.error);
				}
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
