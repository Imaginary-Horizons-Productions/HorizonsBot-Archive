const Command = require('../Classes/Command.js');
const { Permissions } = require('discord.js');
var { roleIDs, isModerator, addModerator, saveObject } = require('../helpers.js');

var command = new Command(["ModPromote", "AddMod"], // aliases
	"Add a Moderator to HorizonsBot's list and give them the role", // description
	"Discord ADMINISTRATOR or Moderator, use from server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ModPromote (user)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Add a Moderator: add to list, give role and channel permissions
	if (receivedMessage.guild) {
		if (receivedMessage.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) || isModerator(receivedMessage.author.id)) {
			let promotee = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id)[0];
			if (promotee) {
				if (!isModerator(promotee.id)) {
					promotee.roles.add(roleIDs.moderator);
					addModerator(promotee.id);
					receivedMessage.channel.send(`${promotee} has been promoted to Moderator.`)
						.catch(console.error);
				} else {
					receivedMessage.author.send(`${promotee} is already a Moderator.`)
						.catch(console.error);
				}
			} else {
				receivedMessage.author.send("Please mention a user to promote to Moderator.")
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
