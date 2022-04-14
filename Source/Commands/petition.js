const Command = require('../../Classes/Command.js');

const options = [
	{ type: "String", name: "topic-name", description: "Make sure the topic doesn't already exist", required: true, choices: {} }
];
const subcomands = [];
module.exports = new Command("petition", "Petition for a topic", options, subcomands);

let joinChannel, getTopicNames, findTopicID, checkPetition;
module.exports.initialize = function (helpers) {
	({ joinChannel, getTopicNames, findTopicID, checkPetition } = helpers);
}

module.exports.execute = (interaction) => {
	// Record a user's petition for a text channel, create channel if sufficient number of petitions
	let topicName = interaction.options.getString("topic-name").toLowerCase();
	if (getTopicNames().includes(topicName)) {
		let channelID = findTopicID(topicName);
		joinChannel(interaction.guild.channels.resolve(channelID), interaction.user);
		interaction.reply({ content: `A channel for ${topicName} already exists, you've been added to that channel.`, ephemeral: true })
			.catch(console.error);
	} else {
		checkPetition(interaction.guild, topicName, interaction.user);
		interaction.reply(`Your petition for **${topicName}** has been recorded!`)
			.catch(console.error);
	}
}
