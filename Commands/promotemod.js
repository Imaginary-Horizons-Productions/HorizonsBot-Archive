const Command = require('../Classes/Command.js');
const { Permissions } = require('discord.js');
var { roleIDs, moderatorIDs, saveObject } = require('../helpers.js');

var command = new Command(["PromoteMod", "AddMod"], // aliases
	"Add a Moderator to HorizonsBot's list and give them the role", // description
	"Discord ADMINISTRATOR or Moderator, must be used from server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot PromoteMod (user)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Add a Moderator: add to list, give role and channel permissions
	if (receivedMessage.guild) {
		if (receivedMessage.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) || moderatorIDs.includes(receivedMessage.author.id)) {
			let promotee = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id)[0];
			if (promotee) {
				if (!moderatorIDs.includes(promotee.id)) {
					promotee.roles.add(roleIDs.moderator);
					moderatorIDs.push(promotee.id);
					saveObject(moderatorIDs, "moderatorIDs.json");
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
