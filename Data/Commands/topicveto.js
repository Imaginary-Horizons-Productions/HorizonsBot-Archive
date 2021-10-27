const Command = require('../../Classes/Command.js');
const { isModerator, getPetitions, setPetitions } = require('../../helpers.js');

module.exports = new Command("topic-veto", "(moderator) Veto a petition");

module.exports.data.addStringOption(option => option.setName("topic").setDescription("The petition to close").setRequired(true));

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
