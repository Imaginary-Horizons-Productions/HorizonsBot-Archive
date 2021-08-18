const Command = require('../Classes/Command.js');
const { guildID, topicListBuilder, clubListBuilder } = require('../helpers.js');

var command = new Command(["List"], // aliases
	"Get a list of topic or club channels", // description
	"N/A", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot List (topic or club)`]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("listtype").setDescription(`Get a list of topic or club channels`).setRequired(true).addChoice("Get the topic list", "topic").addChoice("Get the club list", "club"));

command.execute = (receivedMessage, state) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
	if (state.messageArray.length > 0) {
		let listType = state.messageArray[0].toLowerCase();
		receivedMessage.client.guilds.fetch(guildID).then(guild => {
			if (listType == "topic" || listType == "topics") {
				topicListBuilder(guild.channels).then(embed => {
					receivedMessage.author.send({ embeds: [embed.setFooter("Note: joining or petitioning by select menu not enabled for \"list\" command.")] });
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

command.executeInteraction = (interaction) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
	let listType = interaction.options.getString("listtype").toLowerCase();
	interaction.client.guilds.fetch(guildID).then(guild => {
		if (listType == "topic" || listType == "topics") {
			topicListBuilder(guild.channels).then(embed => {
				interaction.reply({ embeds: [embed.setFooter("Note: joining or petitioning by select menu not enabled for \"list\" command.")], ephemeral: true });
			}).catch(console.error);
		} else if (listType == "club" || listType == "clubs") {
			clubListBuilder(guild.channels).then(embed => {
				interaction.reply({ embeds: [embed], ephemeral: true });
			}).catch(console.error);
		} else {
			interaction.reply({ content: `Please specify either \`topic\` or \`club\` for the type of list.`, ephemeral: true })
				.catch(console.error);
		}
	});
}

module.exports = command;
