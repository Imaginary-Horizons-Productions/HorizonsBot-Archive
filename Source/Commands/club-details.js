const Command = require('../../Classes/Command.js');
const { getClubs, isModerator, updateClubDetails, updateClub } = require('../../helpers.js');

const options = [];
const subcomands = [];
module.exports = new Command("club-details", "(club leader or morderator) Post and pin the club's details embed", options, subcomands);

module.exports.execute = (interaction) => {
	// Posts and pins the club details embed
	let club = getClubs()[interaction.channelId];
	if (club) {
		if (isModerator(interaction.user.id) || (club && interaction.user.id == club.hostId)) {
			updateClubDetails(club, interaction.channel);
			interaction.reply({ content: "The club's details have been updated.", ephemeral: true }).catch(console.error);
			updateList(interaction.guild.channels, "clubs");
			updateClub(club);
		} else {
			interaction.reply({ content: `Pinning club details is restricted to the current club leader and Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please pin club details from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}
