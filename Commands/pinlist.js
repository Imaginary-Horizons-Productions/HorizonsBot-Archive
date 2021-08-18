const Command = require('../Classes/Command.js');
const { isModerator, pinTopicsList, pinClubsList } = require('../helpers.js');

var command = new Command(["PinList"], // aliases
	"Pin the list message for topics or clubs in this channel", // description
	"Moderator, use from server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot PinList (topic or club)`]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("listtype").setDescription(`Pin the list message for topics or clubs in this channel`).setRequired(true).addChoice("Pin the topic list", "topic").addChoice("Pin the club list", "club"));

command.execute = (receivedMessage, state) => {
	// Command specifications go here
	if (isModerator(receivedMessage.author.id)) {
		if (state.messageArray.length > 0) {
			let listType = state.messageArray[0].toLowerCase();
			if (listType == "topic" || listType == "topics") {
				pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
			} else if (listType == "club" || listType == "clubs") {
				pinClubsList(receivedMessage.guild.channels, receivedMessage.channel);
			} else {
				receivedMessage.author.send(`Please specify either \`topic\` or \`club\` for the type of list to pin.`)
					.catch(console.log);
			}
		}
	} else {
		receivedMessage.author.send(`Pinning topic or club lists is restricted to Moderators.`)
			.catch(console.log);
	}
}

command.executeInteraction = (interaction) => {
	// Pin the list message for topics or clubs to the receiving channel
	if (isModerator(interaction.user.id)) {
		let listType = interaction.options.getString("listtype").toLowerCase();
		if (listType == "topic") {
			pinTopicsList(interaction.guild.channels, interaction.channel);
			interaction.reply({ content: "Pinning the topic list succeded.", ephemeral: true })
				.catch(console.error);
		} else if (listType == "club") {
			pinClubsList(interaction.guild.channels, interaction.channel);
			interaction.reply({ content: "Pinning the club list succeded.", ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Please specify either \`topic\` or \`club\` for the type of list to pin.`, ephemeral: true })
				.catch(console.log);
		}
	} else {
		interaction.reply({ content: `Pinning topic or club lists is restricted to Moderators.`, ephemeral: true })
			.catch(console.log);
	}
}

module.exports = command;
