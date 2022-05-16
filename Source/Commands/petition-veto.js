const Command = require('../../Classes/Command.js');

const options = [
	{ type: "String", name: "topic", description: "The petition to close", required: true, choices: [] },
];
const subcomands = [];
module.exports = new Command("petition-veto", "(moderator) Veto a petition", options, subcomands);

let isModerator, getPetitions, setPetitions;
module.exports.initialize = function (helpers) {
	({ isModerator, getPetitions, setPetitions } = helpers);
}

module.exports.execute = (interaction) => {
	// Remove the given petition from the petition list
	if (isModerator(interaction.user.id)) {
		let vetoedPetition = interaction.options.getString('topic');
		let petitions = getPetitions();
		let petitionersIDs = petitions[vetoedPetition];
		if (petitionersIDs) {
			delete petitions[vetoedPetition];
			setPetitions(petitions, interaction.guild.channels);
			interaction.reply(`The petition for ${vetoedPetition} has been vetoed.`)
				.catch(console.error);
		} else {
			interaction.reply(`There doesn't seem to be an open petition for ${vetoedPetition}.`)
				.catch(console.error);
		}
	} else {
		interaction.reply("Vetoing petitions is restricted to Moderators.")
			.catch(console.error);
	}
}
