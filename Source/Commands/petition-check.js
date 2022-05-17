const Command = require('../../Classes/Command.js');
const { isModerator, checkPetition } = require('../../helpers.js');

const options = [
	{ type: "String", name: "topic", description: "The petition to check", required: true, choices: [] },
];
const subcomands = [];
module.exports = new Command("petition-check", "(moderator) Check if a petition has passed in case of desync", options, subcomands);

module.exports.execute = (interaction) => {
	// Remove the given petition from the petition list
	if (isModerator(interaction.user.id)) {
		let topicName = interaction.options.getString("topic").toLowerCase();
		checkPetition(interaction.guild, topicName);
		interaction.reply({ content: `The petition for ${topicName} has been checked.`, ephemeral: true });
	} else {
		interaction.reply("Checking petitions is restricted to Moderators.")
			.catch(console.error);
	}
}
