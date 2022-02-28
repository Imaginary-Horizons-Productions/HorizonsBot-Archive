const Command = require('../../Classes/Command.js');

let options = [
	{ type: "User", name: "target", description: "The user to remove from the topic or club", required: true, choices: {} },
	{ type: "Boolean", name: "ban", description: "Prevent the user from rejoining?", required: false, choices: {} }
];
module.exports = new Command("kick", "(moderator) Remove mentioned users from a topic or club channel", options);

let isModerator, getManagedChannels, getClubs, updateClub;
module.exports.initialize = function (helpers) {
	({ isModerator, getManagedChannels, getClubs, updateClub } = helpers);
}

module.exports.execute = (interaction) => {
	// Remove visibility of receiving channel from mentioned user
	if (isModerator(interaction.user.id)) {
		if (getManagedChannels().includes(interaction.channelId)) {
			var user = interaction.options.getUser("target");
			var club = getClubs()[interaction.channelId];
			if (club) {
				club.userIDs = club.userIDs.filter(memberId => memberId != user.id);
				updateClub(club, interaction.guild.chanels);
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
