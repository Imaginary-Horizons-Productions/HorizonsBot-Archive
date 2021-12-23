const Command = require('../../Classes/Command.js');
const { topicListBuilder, clubListBuilder } = require('../../helpers.js');

module.exports = new Command("list", "Get a list of topic or club channels");

module.exports.data.addStringOption(option => option.setName("list-type").setDescription(`Get a list of topic or club channels`).setRequired(true).addChoice("Get the topic list", "topic").addChoice("Get the club list", "club"));

module.exports.execute = (interaction) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
	let listType = interaction.options.getString("list-type").toLowerCase();
	var listBuilder = listType == "topic" ? topicListBuilder : clubListBuilder;
	listBuilder(interaction.guild.channels).then(messageOptions => {
		messageOptions.ephemeral = true;
		interaction.reply(messageOptions);
	}).catch(console.error);
}
