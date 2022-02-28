const Select = require('../../Classes/Select.js');
const { checkPetition } = require('../../helpers.js');

module.exports = new Select("petitionList");

module.exports.execute = (interaction, args) => {
	// Have the user petition for the selected topics
	interaction.values.forEach(petition => {
		checkPetition(interaction.guild, petition, interaction.user);
	})
	interaction.reply({ content: `You have petitioned for the following topics: ${interaction.values.join(", ")}`, ephemeral: true });
}
