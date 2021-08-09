const Command = require('../Classes/Command.js');
const { isModerator, getManagedChannels, getClubs, updateClub } = require('../helpers.js');

var command = new Command(["Kick"], // aliases
	"Remove mentioned users from a topic or club channel", // description
	"Moderator, must be used from an opt-in channel or club channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot Kick (users)`"]); // texts (must match number of headings)

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

module.exports = command;
