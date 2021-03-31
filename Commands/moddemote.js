const Command = require('../Classes/Command.js');
var { roleIDs, isModerator, removeModerator } = require('../helpers.js');

var command = new Command(["ModDemote"], // aliases
	"Remove a Moderator from HorizonsBot's list and remove the role", // description
	"Bot management permission or Moderator, use from server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ModDemote (user)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Remove a Moderator: remove from list, remove role and channel permissions
	if (receivedMessage.guild) {
		if (!receivedMessage.member.manageable || isModerator(receivedMessage.author.id)) {
			let demotee = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id)[0];
			if (demotee) {
				if (isModerator(demotee.id)) {
					demotee.roles.remove(roleIDs.moderator);
					removeModerator(demotee.id);
					receivedMessage.channel.send(`${demotee} has been demoted from Moderator.`)
						.catch(console.error);
				} else {
					receivedMessage.author.send(`${demotee} is already not a Moderator.`)
						.catch(console.error);
				}
			} else {
				receivedMessage.author.send("Please mention a user to demote from Moderator.")
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`You must be a Moderator to use the \`${state.command}\` command.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`The \`${state.command}\` command must be used from the server.`)
			.catch(console.error);
	}
}

module.exports = command;
