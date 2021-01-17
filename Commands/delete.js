const Command = require('../Classes/Command.js');
const { moderatorIDs, getManagedChannels, deleteChannel } = require('../helpers.js');

var command = new Command(["Delete"], // aliases
	"Delete a topic or campaign channel, or set it to be deleted on a delay", // description
	"Moderator, use the command in a topic or campaign channel to delete", // requirements
	["Example - replace [ ] with settings (optional)"], // headings
	["`@HorizonsBot Delete [delay in hours]`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Delete a topic or campaign channel, or set it to be deleted on a delay
	if (moderatorIDs.includes(receivedMessage.author.id)) {
		if (getManagedChannels().includes(receivedMessage.channel.id)) {
			let delay = parseFloat(state.messageArray[0]);
			if (!isNaN(delay)) {
				receivedMessage.channel.send(`This channel has been scheduled to be deleted in ${delay} hour(s).`)
					.catch(console.error);
				setTimeout(deleteChannel, delay * 3600000, receivedMessage.channel, receivedMessage.guild.channels)
			} else {
				deleteChannel(receivedMessage.channel, receivedMessage.guild.channels);
			}
		} else {
			receivedMessage.author.send("The delete command can only be used on topic or campaign channels.")
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send("Deleting channels is restricted to Moderators.")
			.catch(console.error);
	}
}

module.exports = command;
