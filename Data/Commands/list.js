const Command = require('../../Classes/Command.js');
const { topicListBuilder, clubListBuilder } = require('../../helpers.js');

let options = [
	{
		type: "String", name: "list-type", description: "Get a list of topic or club channels", required: true, choices: {
			"Get the topic list": "topic",
			"Get the club list": "club"
		}
	},
];
module.exports = new Command("list", "Get a list of topic or club channels", options);

module.exports.execute = (interaction) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
	let listType = interaction.options.getString("list-type").toLowerCase();
	var listBuilder = listType == "topic" ? topicListBuilder : clubListBuilder;
	listBuilder(interaction.guild.channels).then(messageOptions => {
		messageOptions.ephemeral = true;
		interaction.reply(messageOptions);
	}).catch(console.error);
}
