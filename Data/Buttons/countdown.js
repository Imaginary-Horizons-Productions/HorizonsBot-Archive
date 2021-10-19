const Button = require('../../Classes/Button.js');
const { clubCountdown } = require('../../helpers.js');

module.exports = new Button("countdown");

module.exports.execute = (interaction, args) => {
	// Calculate the time until the next meeting of the given club
	clubCountdown(interaction, args[0]);
}
