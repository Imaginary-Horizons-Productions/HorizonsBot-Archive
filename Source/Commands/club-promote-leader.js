const Command = require('../../Classes/Command.js');
const { isModerator, getClubs, updateClub, updateClubDetails } = require('../../helpers.js');

const options = [{ type: "User", name: "user", description: "The user's mention", required: true, choices: [] }];
const subcommands = [];
module.exports = new Command("club-promote-leader", "(club leader or moderator) Promote another user to club leader", options, subcommands);

module.exports.execute = (interaction) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[interaction.channelId];
	if (club) {
		if (isModerator(interaction.user.id) || (club && interaction.user.id == club.hostId)) {
			let promotee = interaction.options.getUser("user");
			club.hostId = promotee.id;
			interaction.channel.permissionOverwrites.edit(interaction.user, { "VIEW_CHANNEL": true, "MANAGE_MESSAGES": null }, { type: 1 })
			interaction.channel.permissionOverwrites.edit(promotee, { "VIEW_CHANNEL": true, "MANAGE_MESSAGES": true }, { type: 1 })
			interaction.guild.channels.fetch(club.voiceChannelId).then(voiceChannel => {
				voiceChannel.permissionOverwrites.edit(interaction.user, { "VIEW_CHANNEL": true, "MANAGE_CHANNELS": null, "MANAGE_EVENTS": null }, { type: 1 });
				voiceChannel.permissionOverwrites.edit(promotee, { "VIEW_CHANNEL": true, "MANAGE_CHANNELS": true, "MANAGE_EVENTS": true }, { type: 1 });
			})
			interaction.reply(`${promotee} has been promoted to club leader of this club.`)
				.catch(console.error);
			updateClubDetails(club, interaction.channel);
			updateList(interaction.guild.channels, "clubs");
			updateClub(club);
		} else {
			interaction.reply({ content: `Promoting a club leader is restricted to the current club leader and Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please promote club leaders from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}
