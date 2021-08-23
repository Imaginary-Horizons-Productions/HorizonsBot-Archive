const Command = require('../Classes/Command.js');
const { isModerator, getManagedChannels, getClubs, updateClub } = require('../helpers.js');

var command = new Command(["Kick", "Ban"], // aliases
	"Remove mentioned users from a topic or club channel", // description
	"Moderator, must be used from an opt-in channel or club channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot Kick (users)`"]); // texts (must match number of headings)

command.data.addUserOption(option => option.setName("target").setDescription("The user to remove from the topic or club").setRequired(true))
	.addBooleanOption(option => option.setName("ban").setDescription("Prevent user from rejoining?").setRequired(false));

command.execute = (receivedMessage, state) => {
	// Remove visibility of receiving channel from mentioned user
	if (isModerator(receivedMessage.author.id)) {
		if (getManagedChannels().includes(receivedMessage.channel.id)) {
			Array.from(receivedMessage.mentions.users.values).filter(user => user.id != receivedMessage.client.user.id).forEach(user => {
				receivedMessage.channel.permissionOverwrites.delete(user, `Kicked by ${receivedMessage.author.tag}`);
				var club = getClubs()[receivedMessage.channel.id];
				if (club) {
					club.userIDs = club.userIDs.filter(memberId => memberId != user.id);
					updateClub(club, receivedMessage.guild.chanels);
				}
			})
		} else {
			receivedMessage.author.send(`Please use the \`kick\` command from a topic or club channel.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Kicking users from text channels is restricted to Moderators.`)
			.catch(console.error);
	}
}

command.executeInteraction = (interaction) => {
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

module.exports = command;
