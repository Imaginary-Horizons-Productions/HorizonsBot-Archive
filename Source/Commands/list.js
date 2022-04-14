const Command = require('../../Classes/Command.js');

const options = [
	{
		type: "String", name: "list-type", description: "The list to get", required: true, choices: {
			"Get the topic list": "topic",
			"Get the club list": "club"
		}
	},
];
const subcomands = [];
module.exports = new Command("list", "Get the topic or club list", options, subcomands);

let topicListBuilder, clubListBuilder;
module.exports.initialize = function (helpers) {
	({ topicListBuilder, clubListBuilder } = helpers);
}

module.exports.execute = (interaction) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
	let listType = interaction.options.getString("list-type").toLowerCase();
	var listBuilder = listType == "topic" ? topicListBuilder : clubListBuilder;
	listBuilder(interaction.guild.channels).then(messageOptions => {
		messageOptions.ephemeral = true;
		interaction.reply(messageOptions);
	}).catch(console.error);
}
