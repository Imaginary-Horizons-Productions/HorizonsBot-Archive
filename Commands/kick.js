const Command = require('../Classes/Command.js');
const { isModerator, getManagedChannels, getClubs, updateClub } = require('../helpers.js');

module.exports = new Command("kick", "Remove mentioned users from a topic or club channel");

module.exports.data.addUserOption(option => option.setName("target").setDescription("The user to remove from the topic or club").setRequired(true))
	.addBooleanOption(option => option.setName("ban").setDescription("Prevent user from rejoining?").setRequired(false));

module.exports.execute = (interaction) => {
	// Remove visibility of receiving channel from mentioned user
	if (isModerator(interaction.user.id)) {
		if (getManagedChannels().includes(interaction.channel.id)) {
			var user = interaction.options.getUser("target");
			var club = getClubs()[interaction.channel.id];
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
