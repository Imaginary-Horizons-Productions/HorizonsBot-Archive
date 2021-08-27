const Command = require('../Classes/Command.js');
const { guildID, topicListBuilder, clubListBuilder } = require('../helpers.js');

var command = new Command("list", "Get a list of topic or club channels");

command.data.addStringOption(option => option.setName("listtype").setDescription(`Get a list of topic or club channels`).setRequired(true).addChoice("Get the topic list", "topic").addChoice("Get the club list", "club"));

command.execute = (interaction) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
	let listType = interaction.options.getString("listtype").toLowerCase();
	interaction.client.guilds.fetch(guildID).then(guild => {
		if (listType == "topic") {
			topicListBuilder(guild.channels).then(messageOptions => {
				messageOptions.ephemeral = true;
				interaction.reply(messageOptions);
			}).catch(console.error);
		} else if (listType == "club") {
			clubListBuilder(guild.channels).then(messageOptions => {
				messageOptions.ephemeral = true;
				interaction.reply(messageOptions);
			}).catch(console.error);
		}
	});
}

module.exports = command;
