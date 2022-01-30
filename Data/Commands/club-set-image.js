const Command = require('../../Classes/Command.js');

let options = [{ type: "String", name: "url", description: "The url to the image to set for the club", required: false, choices: {} }];
module.exports = new Command("club-set-image", "(club leader or moderator) Set or clear a club's image url", options);

let isModerator, getClubs, updateClub, updateClubDetails;
module.exports.initialize = function (helpers) {
	({ isModerator, getClubs, updateClub, updateClubDetails } = helpers);
}

module.exports.execute = (interaction) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[interaction.channelId];
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
			updateClubDetails(club, interaction.channel);
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
