const Select = require('../../Classes/Select.js');
const { clubInvite } = require('../../helpers.js');

module.exports = new Select("clubList");

module.exports.execute = (interaction, args) => {
	// Provide club details embed to the user for the selected clubs
	interaction.values.forEach(channelID => {
		clubInvite(interaction, channelID, interaction.user); // resolves the interaction
	})
}
