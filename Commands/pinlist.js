const Command = require('../Classes/Command.js');
const { isModerator, pinTopicsList, pinClubsList } = require('../helpers.js');

var command = new Command(["PinList"], // aliases
	"Pin a list of topics or clubs", // description
	"Moderator, use from server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot PinList (topic or club)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Command specifications go here
	if (isModerator(receivedMessage.author.id)) {
		if (receivedMessage.guild) {
			if (state.messageArray.length > 0) {
				let listType = state.messageArray[0].toLowerCase();
				if (listType == "topic" || listType == "topics") {
					pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
				} else if (listType == "club" || listType == "clubs") {
					pinClubsList(receivedMessage.guild.channels, receivedMessage.channel);
				} else {
					receivedMessage.author.send(`Please specify either \`topic\` or \`club\` for the type of list to pin.`)
						.catch(console.log);
				}
			}
		} else {
			receivedMessage.author.send(`Pinning topic or club lists is restricted to Moderators.`)
				.catch(console.log);
		}
	} else {
		receivedMessage.author.send(`Please specify either \`topic\` or \`club\` for the type of list.`)
			.catch(console.log);
	}
}

module.exports = command;
