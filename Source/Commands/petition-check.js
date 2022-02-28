const Command = require('../../Classes/Command.js');

let options = [
	{ type: "String", name: "topic", description: "The petition to check", required: true, choices: {} },
];
module.exports = new Command("petition-check", "(moderator) Check if a petition has passed in case of desync", options);

let isModerator, checkPetition;
module.exports.initialize = function (helpers) {
	({ isModerator, checkPetition } = helpers);
}

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
