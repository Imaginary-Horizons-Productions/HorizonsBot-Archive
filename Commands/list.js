const Command = require('../Classes/Command.js');
const {guildID, topicListBuilder, campaignListBuilder} = require('../helpers.js');

var command = new Command(["List"], // aliases
	"Provide a list of topic or campaign channels", // description
	"None", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot List (topic or campaign)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Determine if user mentioned a topic or campaign, then provide appropriate permissions
	if (state.messageArray.length > 0) {
		let listType = state.messageArray[0].toLowerCase();
		let guild = receivedMessage.client.guilds.resolve(guildID);
		if (listType == "topic" || listType == "topics") {
			topicListBuilder(guild.channels).then(embed => {
				receivedMessage.author.send(embed);
			}).catch(console.log);
		} else if (listType == "campaign" || listType == "campaigns") {
			//TODO impliment for campaigns
		} else {
			receivedMessage.author.send(`Please specify either \`topic\` or \`campaign\` for the type of list.`)
				.catch(console.log);
		}
	} else {
		receivedMessage.author.send(`Please specify either \`topic\` or \`campaign\` for the type of list.`)
			.catch(console.log);
	}
}

module.exports = command;
