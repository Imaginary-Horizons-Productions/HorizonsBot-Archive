const Command = require('../Classes/Command.js');
const { isModerator, removeTopicEmoji, addTopicEmoji, updateList } = require('../helpers.js');

var command = new Command(["SetChannelEmoji", "SetChannelEmote"], // aliases
	"Associate an emoji with a channel for joining via reaction", // description
	"Moderator, use from relevant channel", // requirements
	["Example"], // headings
	["`@HorizonsBot SetChannelEmoji`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Associates the provided emoji with the topic or campaign channel for joining via reaction
	if (isModerator(receivedMessage.author.id)) {
		receivedMessage.channel.send(`${receivedMessage.author}, react to this message with the emoji to use for reaction-joining. Alternatively, react with :no_entry_sign: to clear the emoji.`).then(async message => {
			await message.react(`🚫`);
			let collector = message.createReactionCollector((reaction, user) => { return user.id == receivedMessage.author.id }, { "max": 1 });

			collector.on("collect", (reaction) => {
				if (reaction.emoji.name == "🚫") {
					removeTopicEmoji(receivedMessage.channel.id);
				} else {
					addTopicEmoji(reaction.emoji, receivedMessage.channel.id);
				}
				updateList(receivedMessage.guild.channels, "topics");
				message.edit(`Channel emoji configuration complete.`)
					.catch(console.error);
			})
		})
	} else {
		receivedMessage.author.send(`Setting channel emoji is restricted to Moderators.`)
			.catch(console.error);
	}
}

module.exports = command;
