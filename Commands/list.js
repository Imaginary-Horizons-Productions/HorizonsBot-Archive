const Command = require('../Classes/Command.js');
const { guildID, topicListBuilder, clubListBuilder } = require('../helpers.js');

var command = new Command(["List"], // aliases
	"Provide a list of topic or club channels", // description
	"N/A", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot List (topic or club)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
	if (state.messageArray.length > 0) {
		let listType = state.messageArray[0].toLowerCase();
		receivedMessage.client.guilds.fetch(guildID).then(guild => {
			if (listType == "topic" || listType == "topics") {
				topicListBuilder(guild.channels).then(embed => {
					receivedMessage.author.send({ embeds: [embed.setFooter("Note: joining by reaction not enabled for \"list\" command.")] });
				}).catch(console.log);
			} else if (listType == "club" || listType == "clubs") {
				clubListBuilder(guild.channels).then(embed => {
					receivedMessage.author.send({ embeds: [embed] });
				})
			} else {
				receivedMessage.author.send(`Please specify either \`topic\` or \`club\` for the type of list.`)
					.catch(console.log);
			}
		});
	} else {
		receivedMessage.author.send(`Please specify either \`topic\` or \`club\` for the type of list.`)
			.catch(console.log);
	}
}

module.exports = command;
