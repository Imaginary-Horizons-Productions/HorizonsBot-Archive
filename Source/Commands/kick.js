const Command = require('../../Classes/Command.js');
const { isModerator, getManagedChannels, getClubs, updateList, updateClub } = require('../../helpers.js');

const options = [
	{ type: "User", name: "target", description: "The user's mention", required: true, choices: [] },
	{ type: "Boolean", name: "ban", description: "Prevent the user from rejoining?", required: false, choices: [] }
];
const subcomands = [];
module.exports = new Command("kick", "(moderator) Remove a user from a topic or club", options, subcomands);

module.exports.execute = (interaction) => {
	// Remove visibility of receiving channel from mentioned user
	if (isModerator(interaction.user.id)) {
		if (getManagedChannels().includes(interaction.channelId)) {
			var user = interaction.options.getUser("target");
			var club = getClubs()[interaction.channelId];
			if (club) {
				club.userIds = club.userIds.filter(memberId => memberId != user.id);
				updateList(interaction.guild.chanels, "clubs");
				updateClub(club);
			}
			if (interaction.options.getBoolean("ban")) {
				interaction.channel.permissionOverwrites.create(user.id, { VIEW_CHANNEL: false }, `Banned by ${interaction.user}`);
				interaction.reply(`${user} has been banned from this channel.`)
					.catch(console.error);
			} else {
				interaction.channel.permissionOverwrites.delete(user, `Kicked by ${interaction.user}`);
				interaction.reply(`${user} has been kicked from this channel.`)
					.catch(console.error);
			}
		} else {
			interaction.reply(`Please use the \`kick\` command from a topic or club channel.`)
				.catch(console.error);
		}
	} else {
		interaction.reply(`Kicking users from text channels is restricted to Moderators.`)
			.catch(console.error);
	}
}
