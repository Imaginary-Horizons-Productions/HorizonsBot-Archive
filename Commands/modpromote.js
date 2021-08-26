const Command = require('../Classes/Command.js');
var { getModRoleID, isModerator, addModerator } = require('../helpers.js');

var command = new Command(["ModPromote", "AddMod"], // aliases
	"Add a Moderator to HorizonsBot's list and give them the role", // description
	"Bot management permission or Moderator, use from server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ModPromote (user)`"]); // texts (must match number of headings)

command.data.addMentionableOption(option => option.setName("promotee").setDescription("The user to promote to moderator").setRequired(true));

command.execute = (receivedMessage, state) => {
	// Add a Moderator: add to list, give role and channel permissions
	if (receivedMessage.guild) {
		if (!receivedMessage.member.manageable || isModerator(receivedMessage.author.id)) {
			let promotee = receivedMessage.mentions.members.map(member => member).filter(member => member.id != receivedMessage.client.user.id)[0];
			if (promotee) {
				if (!isModerator(promotee.id)) {
					promotee.roles.add(getModRoleID());
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

command.executeInteraction = (interaction) => {
	// Add a Moderator: add to list, give role and channel permissions
	if (isModerator(interaction.user.id) || !interaction.member.manageable) {
		let promotee = interaction.options.getMentionable("promotee");
		if (!isModerator(promotee.id)) {
			promotee.roles.add(getModRoleID());
			addModerator(promotee.id);
			interaction.reply(`${promotee} has been promoted to Moderator.`)
				.catch(console.error);
		} else {
			interaction.reply({ content: `${promotee} is already a Moderator.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${state.command}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
