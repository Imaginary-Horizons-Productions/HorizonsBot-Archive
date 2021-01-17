const Command = require('../Classes/Command.js');
const { isModerator, listMessages, saveObject, topicListBuilder, campaignListBuilder } = require('../helpers.js');

var command = new Command(["PinList"], // aliases
	"Pins a list of topic channles or TRPG campaigns to the receiving channel", // description
	"Moderator, must be used from server channel", // requirements
	["__Example__ - replace ( ) with your settings"], // headings
	[`@HorizonsBot PinList (topic or campaign)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Command specifications go here
	if (isModerator(receivedMessage.author.id)) {
		if (receivedMessage.guild) {
			if (state.messageArray.length > 0) {
				let listType = state.messageArray[0].toLowerCase();
				if (listType == "topic" || listType == "topics") {
					topicListBuilder(receivedMessage.guild.channels).then(embed => {
						receivedMessage.channel.send(embed).then(message => {
							listMessages.topics = {
								"messageID": message.id,
								"channelID": message.channel.id
							}
							message.pin();
							saveObject(listMessages, "listMessageIDs.json");
						})
					}).catch(console.log);
				} else if (listType == "campaign" || listType == "campaigns") {
					//TODO impliment for campaigns
				} else {
					receivedMessage.author.send(`Please specify either \`topic\` or \`campaign\` for the type of list to pin.`)
						.catch(console.log);
				}
			}
		} else {
			receivedMessage.author.send(`Pinning topic or campaign lists is restricted to Moderators.`)
				.catch(console.log);
		}
	} else {
		receivedMessage.author.send(`Please specify either \`topic\` or \`campaign\` for the type of list.`)
			.catch(console.log);
	}
}

module.exports = command;
